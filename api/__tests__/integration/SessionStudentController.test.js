import request from 'supertest';
import { addMonths, subMonths } from 'date-fns';
import app from '../../src/app';
import factory from '../utils/factory';
import { truncateSequelize } from '../utils/database';

describe('SessionStudentController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao autenticar com um estudande que não existe deve exibir uma mensagem de erro', async () => {
    const response = await request(app.server)
      .post('/sessions/student')
      .send({
        id: 1,
      });

    expect(response.body.error).toBe('Estudante não encontrado.');
  });

  it('ao autenticar com um estudante que não existe matrícula ativa deve exibir uma mensagem de erro', async () => {
    const plan = await factory.create('GoldPlan');
    const student = await factory.create('Student');
    const startDate = addMonths(new Date(), 1);
    await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      price: plan.price * plan.duration,
      start_date: startDate,
      end_date: addMonths(startDate, plan.duration),
    });
    const response = await request(app.server)
      .post('/sessions/student')
      .send({
        id: student.id,
      });

    expect(response.body.error).toBe('Sua matrícula não está ativa');
  });

  it('ao autenticar com um estudante que possui matrícula ativa deve os dados do aluno', async () => {
    const plan = await factory.create('GoldPlan');
    const student = await factory.create('Student');
    const startDate = subMonths(new Date(), 1);
    await factory.create('Enrollment', {
      student_id: student.id,
      plan_id: plan.id,
      price: plan.price * plan.duration,
      start_date: startDate,
      end_date: addMonths(startDate, plan.duration),
    });
    const response = await request(app.server)
      .post('/sessions/student')
      .send({
        id: student.id,
      });

    expect(response.body.student.name).toBe(student.name);
    expect(response.body.student.email).toBe(student.email);
  });
});
