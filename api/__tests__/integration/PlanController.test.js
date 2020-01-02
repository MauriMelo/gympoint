import request from 'supertest';
import app from '../../src/app';
import factory from '../utils/factory';
import { truncateSequelize } from '../utils/database';
import auth from '../utils/auth';

describe('HelpOrderStudentController', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao acessar rota de planos deve exibir uma listagem de todos os planos cadastrados', async () => {
    await factory.create('StartPlan');
    await factory.create('GoldPlan');
    await factory.create('DiamondPlan');

    const token = await auth();
    const response = await request(app.server)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.plans).toHaveLength(3);
    expect(response.body.plans[0].title).toBe('Start');
    expect(response.body.plans[1].title).toBe('Gold');
    expect(response.body.plans[2].title).toBe('Diamond');
  });

  it('ao consultar um plano específico que não existe no banco de dados deve retornar uma mensagem de erro', async () => {
    const token = await auth();
    const response = await request(app.server)
      .get('/plans/1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Plano não encontrado.');
  });

  it('ao consultar um plano específico que existe no banco de dados deve retornar as informações do plano', async () => {
    const plan = await factory.create('GoldPlan');
    const token = await auth();
    const response = await request(app.server)
      .get(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.title).toBe('Gold');
    expect(response.body.duration).toBe(3);
    expect(response.body.price).toBe(109.9);
  });

  it('ao criar um plano sem passar a descrição ou duração ou preço do plano deve retornar uma mensagem de erro', async () => {
    const token = await auth();
    let response = await request(app.server)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        duration: 3,
        price: 29.9,
      });

    expect(response.body.error).toBe('title is a required field');

    response = await request(app.server)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        price: 29.9,
      });

    expect(response.body.error).toBe('duration is a required field');

    response = await request(app.server)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        duration: 3,
      });

    expect(response.body.error).toBe('price is a required field');
  });

  it('ao criar um plano passando as informações do plano deve retornar as informações do plano cadastrado', async () => {
    const token = await auth();
    const response = await request(app.server)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        duration: 3,
        price: 29.9,
      });

    expect(response.body.title).toBe('Plan Test');
    expect(response.body.duration).toBe(3);
    expect(response.body.price).toBe(29.9);
  });

  it('ao atualizar um plano sem passar a descrição ou duração ou preço do plano deve retornar uma mensagem de erro', async () => {
    const plan = await factory.create('StartPlan');
    const token = await auth();
    let response = await request(app.server)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        duration: 3,
        price: 29.9,
      });

    expect(response.body.error).toBe('title is a required field');

    response = await request(app.server)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        price: 29.9,
      });

    expect(response.body.error).toBe('duration is a required field');

    response = await request(app.server)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        duration: 3,
      });

    expect(response.body.error).toBe('price is a required field');
  });

  it('ao atualizar um plano que não existe deve retornar uma mensagem de erro', async () => {
    const token = await auth();
    const response = await request(app.server)
      .put(`/plans/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        duration: 3,
        price: 29.9,
      });

    expect(response.body.error).toBe('Plano não encontrado.');
  });

  it('ao atualizar um plano com as informações corretas então deve exibir as informações do plano cadastrado', async () => {
    const plan = await factory.create('StartPlan');
    const token = await auth();
    const response = await request(app.server)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Plan Test',
        duration: 3,
        price: 29.9,
      });

    expect(response.body.title).toBe('Plan Test');
    expect(response.body.duration).toBe(3);
    expect(response.body.price).toBe(29.9);
  });

  it('ao remover um plano que não existe deve retornar uma mensagem de erro', async () => {
    const token = await auth();
    const response = await request(app.server)
      .delete(`/plans/1`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.error).toBe('Plano não encontrado.');
  });

  it('ao remover um plano ele não poderá mais ser consultado pela api', async () => {
    const plan = await factory.create('StartPlan');
    const token = await auth();
    let response = await request(app.server)
      .delete(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    response = await request(app.server)
      .get(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.error).toBe('Plano não encontrado.');
  });
});
