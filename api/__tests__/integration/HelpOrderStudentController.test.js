import request from 'supertest';
import app from '../../src/app';
import factory from '../utils/factory';
import { truncateSequelize, dropMongoDatabase } from '../utils/database';

describe('HelpOrderStudentController', () => {
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

  it('ao aluno consultar seus auxílios deve exibir retornar uma listagem com paginação', async () => {
    const student = await factory.create('Student');
    await factory.createMany('HelpOrder', 12, {
      student_id: student.id,
    });

    let response = await request(app.server).get(
      `/students/${student.id}/help-orders`
    );

    expect(response.body.orders).toHaveLength(10);
    expect(response.body).toHaveProperty('pagination');

    response = await request(app.server).get(
      `/students/${student.id}/help-orders?page=2`
    );

    expect(response.body.orders).toHaveLength(2);
  });

  it('ao aluno pedir novo auxílio sem preencher a pergunta deve retornar um erro', async () => {
    const student = await factory.create('Student');
    await factory.createMany('HelpOrder', 12, {
      student_id: student.id,
    });

    const response = await request(app.server)
      .post(`/students/${student.id}/help-orders`)
      .send();

    expect(response.body.error).toBe('question is a required field');
  });

  it('ao aluno pedir novo auxílio deve retornar os dados do auxílio cadastrado', async () => {
    const student = await factory.create('Student');
    await factory.createMany('HelpOrder', 12, {
      student_id: student.id,
    });

    const response = await request(app.server)
      .post(`/students/${student.id}/help-orders`)
      .send({
        question: 'Pergunta de teste para auxílio',
      });

    expect(response.body.student_id).toBe(student.id);
    expect(response.body.question).toBe('Pergunta de teste para auxílio');
  });
});
