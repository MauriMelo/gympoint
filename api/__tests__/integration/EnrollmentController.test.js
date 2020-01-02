import request from 'supertest';
import { addMonths, subMonths } from 'date-fns';
import app from '../../src/app';
import factory from '../utils/factory';
import { truncateSequelize, dropMongoDatabase } from '../utils/database';
import auth from '../utils/auth';

describe('EnrollmentController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
    await dropMongoDatabase();
  });

  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao consultar matrículas e não tiver nenhum registro então deve retornar 404', async () => {
    const token = auth();
    const response = await request(app.server)
      .get('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Matrícula não encontrada');
  });

  it('ao consultar matrículas e tiver registros então retorna 200 com a listagem de matrículas', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const now = new Date();
    await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    const response = await request(app.server)
      .get('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.enrollments).toHaveLength(1);
  });

  it('ao consultar matrículas com vários registro então exibe paginação', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const now = new Date();
    await factory.createMany('Enrollment', 12, {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    let response = await request(app.server)
      .get('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.enrollments).toHaveLength(10);
    expect(response.body).toHaveProperty('pagination');

    response = await request(app.server)
      .get('/enrollments?page=2')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.enrollments).toHaveLength(2);
  });

  it('ao criar uma matrícula sem aluno, plano e data de início deve retornar uma mensagem de erro', async () => {
    const token = auth();
    let response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: 1,
      });

    expect(response.body.error).toBe('student_id is a required field');

    response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        student_id: 1,
      });

    expect(response.body.error).toBe('plan_id is a required field');

    response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan_id: 1,
        student_id: 1,
      });

    expect(response.body.error).toBe('start_date is a required field');
  });

  it('ao tentar criar uma matrícula com uma data passada deve retornar uma mensagem de erro que apenas datas futuras podem ser utilizadas', async () => {
    const token = auth();
    const response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: subMonths(new Date(), 1),
        plan_id: 1,
        student_id: 1,
      });

    expect(response.body.error).toBe('Apenas datas futuras são permitidas');
  });

  it('ao tentar criar uma matrícula com um plano que não existe deve retornar uma mensagem de erro', async () => {
    const token = auth();
    const response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: 1,
        student_id: 1,
      });

    expect(response.body.error).toBe('Plano não encontrado.');
  });

  it('ao tentar criar uma matrícula com um aluno que não existe deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');

    const token = auth();
    const response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: plan.id,
        student_id: 1,
      });

    expect(response.body.error).toBe('Estudante não encontrado.');
  });

  it('ao tentar criar uma matrícula com um aluno que já está matrículado no plano selecionado deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');
    const student = await factory.create('Student');
    const now = new Date();
    await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    const response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: plan.id,
        student_id: student.id,
      });

    expect(response.body.error).toBe(
      'Este aluno já está matrículado neste plano'
    );
  });

  it('ao tentar criar uma matrícula com informações validas deve retornar as informações da matrícula calculadas corretamente', async () => {
    const plan = await factory.create('StartPlan');
    const student = await factory.create('Student');

    const now = new Date();
    const token = auth();
    const response = await request(app.server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: now,
        plan_id: plan.id,
        student_id: student.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.plan_id).toBe(plan.id);
    expect(response.body.student_id).toBe(student.id);
    expect(response.body.start_date).toBe(now.toISOString());
    expect(response.body.end_date).toBe(
      addMonths(now, plan.duration).toISOString()
    );
    expect(response.body.price).toBe(plan.price * plan.duration);
  });

  it('ao atualizar uma matrícula sem aluno, plano e data de início deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');
    const student = await factory.create('Student');
    const now = new Date();
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    let response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: plan.id,
      });

    expect(response.body.error).toBe('student_id is a required field');

    response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        student_id: student.id,
      });

    expect(response.body.error).toBe('plan_id is a required field');

    response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan_id: plan.id,
        student_id: student.id,
      });

    expect(response.body.error).toBe('start_date is a required field');
  });

  it('ao atualizar uma matrícula que não existe deve retornar 404 e uma mensagem de erro', async () => {
    const token = auth();
    const response = await request(app.server)
      .put(`/enrollments/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        plan_id: 1,
        student_id: 1,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Matrícula não encontrada.');
  });

  it('ao atualizar uma matrícula para um plano que não existe deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');
    const student = await factory.create('Student');
    const now = new Date();
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    const response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        student_id: student.id,
        plan_id: 1,
      });

    expect(response.body.error).toBe('Plano não encontrado.');
  });

  it('ao atualizar uma matrícula para um aluno que não existe deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');
    const student = await factory.create('Student');
    const now = new Date();
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const token = auth();
    const response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        student_id: 1,
        plan_id: plan.id,
      });

    expect(response.body.error).toBe('Estudante não encontrado.');
  });

  it('ao atualizar uma matrícula para um plano que o aluno já está matriculado deve retornar uma mensagem de erro', async () => {
    const student = await factory.create('Student');
    const startPlan = await factory.create('StartPlan');
    await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: startPlan.id,
      start_date: new Date(),
      price: startPlan.price * startPlan.duration,
      end_date: addMonths(new Date(), startPlan.duration),
    });

    const goldPlan = await factory.create('GoldPlan');
    const goldEnrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: goldPlan.id,
      start_date: new Date(),
      price: goldPlan.price * goldPlan.duration,
      end_date: addMonths(new Date(), goldPlan.duration),
    });

    const token = auth();
    const response = await request(app.server)
      .put(`/enrollments/${goldEnrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: new Date(),
        student_id: student.id,
        plan_id: startPlan.id,
      });

    expect(response.body.error).toBe(
      'Aluno já está matrículado no plano selecionado'
    );
  });

  it('ao atualizar uma matrícula para outro plano deve retornar a matricula com os dados calculados corretamente', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('StartPlan');
    const now = new Date();
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });

    const goldPlan = await factory.create('GoldPlan');
    const token = auth();
    const response = await request(app.server)
      .put(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: now,
        student_id: student.id,
        plan_id: goldPlan.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.plan_id).toBe(goldPlan.id);
    expect(response.body.student_id).toBe(student.id);
    expect(response.body.start_date).toBe(now.toISOString());
    expect(response.body.end_date).toBe(
      addMonths(now, goldPlan.duration).toISOString()
    );
    expect(response.body.price).toBe(goldPlan.price * goldPlan.duration);
  });

  it('ao consultar uma matrícula que não existe deve retornar 404 com uma mensagem de erro', async () => {
    const token = auth();
    const response = await request(app.server)
      .get(`/enrollments/1`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Matrícula não encontrada.');
  });

  it('ao consultar uma matrícula que está ativa deve retornar o atríbuto active como true', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const now = subMonths(new Date(), 1);
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });
    const token = auth();
    const response = await request(app.server)
      .get(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.active).toBe(true);
  });

  it('ao consultar uma matrícula que está não está ativa deve retornar o atríbuto active como false', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const now = addMonths(new Date(), 1);
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });
    const token = auth();
    const response = await request(app.server)
      .get(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.active).toBe(false);
  });

  it('ao deletar uma matrícula que não existe deve retornar 404 com uma mensagem de erro', async () => {
    const token = auth();
    const response = await request(app.server)
      .delete(`/enrollments/1`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Matrícula não encontrada.');
  });

  it('ao deletar uma matrícula que existe deve retornar 200 e a matrícula não pode mais ser consultada', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('GoldPlan');
    const now = addMonths(new Date(), 1);
    const enrollment = await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      start_date: now,
      price: plan.price * plan.duration,
      end_date: addMonths(now, plan.duration),
    });
    const token = auth();
    let response = await request(app.server)
      .delete(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    response = await request(app.server)
      .get(`/enrollments/${enrollment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.error).toBe('Matrícula não encontrada.');
  });
});
