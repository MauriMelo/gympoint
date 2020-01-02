import request from 'supertest';
import app from '../../src/app';
import factory from '../utils/factory';
import { truncateSequelize, dropMongoDatabase } from '../utils/database';
import auth from '../utils/auth';

describe('HelpOrderController.js', () => {
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

  it('ao consultar lista de auxílios pedidos pelos alunos deve retornar uma listagem com paginação', async () => {
    const token = auth();

    const student = await factory.create('Student');
    factory.createMany('HelpOrder', 12, {
      student_id: student.id,
    });

    let response = await request(app.server)
      .get('/help-orders')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.orders).toHaveLength(10);
    expect(response.body).toHaveProperty('pagination');

    response = await request(app.server)
      .get('/help-orders?page=2')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.orders).toHaveLength(2);
  });

  it('ao responder um  auxílios sem preencher a resposta deve retornar uma mensagem de erro', async () => {
    const token = auth();

    const student = await factory.create('Student');
    const order = await factory.create('HelpOrder', {
      student_id: student.id,
    });

    const response = await request(app.server)
      .put(`/help-orders/${order.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.error).toBe('answer is a required field');
  });

  it('ao responder um  auxílios que não existe deve retornar uma mensagem de erro', async () => {
    const token = auth();
    const response = await request(app.server)
      .put(`/help-orders/1/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'resposta auxílio',
      });

    expect(response.body.error).toBe('Auxílio não encontrado.');
  });

  it('ao responder um  auxílios que já foi respondido deve retornar uma mensagem de erro', async () => {
    const token = auth();
    const student = await factory.create('Student');
    const order = await factory.create('HelpOrder', {
      student_id: student.id,
      answer: 'Auxílio já respodido',
      answer_at: new Date(),
    });
    const response = await request(app.server)
      .put(`/help-orders/${order.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'resposta auxílio',
      });

    expect(response.body.error).toBe('Este auxílio já foi respondido');
  });

  it('ao responder um  auxílios deve retornar as informações do auxílio respondido', async () => {
    const token = auth();
    const student = await factory.create('Student');
    const order = await factory.create('HelpOrder', {
      student_id: student.id,
    });
    const response = await request(app.server)
      .put(`/help-orders/${order.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'resposta auxílio',
      });

    expect(response.body.answer).toBe('resposta auxílio');
  });
});
