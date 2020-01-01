import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import { truncateSequelize } from '../utils/database';
import User from '../../src/app/models/User';

describe('SessionController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });
  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao realizar login passando corpo de requisição inválida deve exibir uma mensagem de erro', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'admin@gmail.com',
        password: '123456',
      });

    expect(response.body.error).toBe('Content-Type inválido.');
  });

  it('ao realizar login sem passar o email ou senha deve exibir uma mensagem de erro', async () => {
    let response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send();

    expect(response.body.error).toBe('Email e password inválido');

    response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'admin@gmail.com',
      });

    expect(response.body.error).toBe('Email e password inválido');
  });

  it('ao realizar login com usuário que não existe deve exibir a mensagem de não autorizado', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'usetnotfound@gmail.com',
        password: '123456',
      });

    expect(response.body.error).toBe('Não autorizado');
  });

  it('ao realizar login com com senha inválida deve exibir a mensagem de não autorizado', async () => {
    User.create({
      name: 'User',
      email: 'user@gmail.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'user@gmail.com',
        password: '444',
      });

    expect(response.body.error).toBe('Não autorizado');
  });

  it('ao realizar login com com senha válida deve exibir retornar o token e as informações do usuário', async () => {
    User.create({
      name: 'User',
      email: 'user@gmail.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'user@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
