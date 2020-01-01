import request from 'supertest';
import { addMonths } from 'date-fns';
import app from '../../src/app';
import factory from '../utils/factory';
import auth from '../utils/auth';
import { truncateSequelize } from '../utils/database';

describe('AuthMiddleware.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });
  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao consultar lista de estudantes e não tiver nenhum registro deve retornar 404', async () => {
    const token = await auth();
    const response = await request(app.server)
      .get('/students')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Nenhum estudante foi encontrado');
  });

  it('ao consultar lista de estudantes deve retornar uma listagem com paginação', async () => {
    await factory.createMany('Student', 12);
    const token = await auth();
    let response = await request(app.server)
      .get('/students')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.students).toHaveLength(10);
    response = await request(app.server)
      .get('/students?page=2')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.body.students).toHaveLength(2);
  });

  it('ao consultar um estudante que não existe deve retornar 404', async () => {
    const token = await auth();
    const response = await request(app.server)
      .get('/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Estudante não encontrado');
  });

  it('ao consultar um estudante que existe deve retornar os dados do estudante', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    const response = await request(app.server)
      .get(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.name).toBe(student.name);
    expect(response.body.email).toBe(student.email);
  });

  it('ao consultar um estudante que existe deve retornar os dados do estudante', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    const response = await request(app.server)
      .get(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.name).toBe(student.name);
    expect(response.body.email).toBe(student.email);
  });

  it('ao criar um estudante deve validar se os dados do estudante estão corretos', async () => {
    const token = await auth();
    let response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'test@gmail.com',
      });

    expect(response.body.error).toBe('name is a required field');

    response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
      });

    expect(response.body.error).toBe('email is a required field');

    response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'invalid-email',
      });

    expect(response.body.error).toBe('email must be a valid email');

    response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'test@gmail.com',
        age: 'string',
      });

    expect(response.body.error).toBe(
      'age must be a `number` type, but the final value was: `NaN` (cast from the value `"string"`).'
    );
  });

  it('ao criar um estudante com um e-mail que já existe deve retornar um erro', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    const response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Student',
        email: student.email,
      });

    expect(response.body.error).toBe('Este e-mail já está em uso.');
  });

  it('ao criar um estudante válido deve retornar os dados cadastrados', async () => {
    const token = await auth();
    const response = await request(app.server)
      .post(`/students`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Student',
        email: 'test@gmail.com',
        age: 25,
      });

    expect(response.body.name).toBe('New Student');
    expect(response.body.email).toBe('test@gmail.com');
    expect(response.body.age).toBe(25);
  });

  it('ao atualizar um estudante deve validar se os dados do estudante estão corretos', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    let response = await request(app.server)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'invalid-email',
      });

    expect(response.body.error).toBe('email must be a valid email');

    response = await request(app.server)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'test@gmail.com',
        age: 'string',
      });

    expect(response.body.error).toBe(
      'age must be a `number` type, but the final value was: `NaN` (cast from the value `"string"`).'
    );
  });

  it('ao atualizar um estudante que não existe deve apresentar uma mensagem de erro', async () => {
    const token = await auth();
    const response = await request(app.server)
      .put(`/students/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'test@gmail.com',
        age: 25,
      });

    expect(response.body.error).toBe('Estudante não encontrado');
  });

  it('ao atualizar o e-mail do estudante para outro que já existe deve retornar uma mensagem de erro', async () => {
    const student1 = await factory.create('Student');
    await factory.create('Student', {
      email: 'email@gmail.com',
    });
    const token = await auth();
    const response = await request(app.server)
      .put(`/students/${student1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Name',
        email: 'email@gmail.com',
        age: 25,
      });

    expect(response.body.error).toBe('Este e-mail já está em uso.');
  });

  it('ao atualizar estudante com os dados corretos deve exibir as informações atualizadas', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    const response = await request(app.server)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Update',
        email: 'update@gmail.com',
        age: 25,
      });

    expect(response.body.name).toBe('Test Update');
    expect(response.body.email).toBe('update@gmail.com');
    expect(response.body.age).toBe(25);
  });

  it('ao remover estudante que não existe deve retornar uma mensagem de erro', async () => {
    const token = await auth();
    const response = await request(app.server)
      .delete(`/students/1`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.error).toBe('Estudante não encontrado');
  });

  it('ao remover estudante o mesmo não pode ser mais consultado', async () => {
    const student = await factory.create('Student');
    const token = await auth();
    let response = await request(app.server)
      .delete(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    response = await request(app.server)
      .get(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.body.error).toBe('Estudante não encontrado');
  });

  it('ao remover estudante passando o parametro remove_enrollments deve remover as matriculas do aluno', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: new Date(),
      end_date: addMonths(new Date(), plan.duration),
      price: plan.price * plan.duration,
    });
    const token = await auth();
    let response = await request(app.server)
      .delete(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        remove_enrollments: true,
      });

    expect(response.status).toBe(200);
    response = await request(app.server)
      .get(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.body.error).toBe('Matrícula não encontrada.');

    response = await request(app.server)
      .get(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.body.error).toBe('Estudante não encontrado');
  });
});
