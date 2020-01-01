import request from 'supertest';
import app from '../../src/app';
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
  it('ao consultar uma rota autenticada sem passar o Header de autorização inválido deve retornar unauthorized', async () => {
    const response = await request(app.server).get('/students');
    expect(response.body.error).toBe('Unauthorized');
  });

  it('ao consultar uma rota autenticada com o Header de autorização inválido deve retornar unauthorized', async () => {
    const response = await request(app.server)
      .get('/students')
      .set('Authorization', '1234')
      .send();
    expect(response.body.error).toBe('Unauthorized');
  });

  it('ao consultar uma rota autenticada com o token inválido deve retornar unauthorized', async () => {
    const response = await request(app.server)
      .get('/students')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
      .send();
    expect(response.body.error).toBe('Unauthorized');
  });

  it('ao consultar uma rota autenticada com o token válido deve exibir as informações pedidas', async () => {
    const token = await auth();
    const response = await request(app.server)
      .get('/students')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.body.error).toBe('Nenhum estudante foi encontrado');
  });
});
