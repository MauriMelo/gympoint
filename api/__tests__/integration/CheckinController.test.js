import request from 'supertest';
import MockDate from 'mockdate';
import app from '../../src/app';
import Checkin from '../../src/app/schema/Checkin';
import { truncateSequelize, dropMongoDatabase } from '../utils/database';

describe('CheckinController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
    await dropMongoDatabase();
    MockDate.reset();
  });
  afterAll(async () => {
    await app.database.connection.close();
    const connection = await app.database.mongooseConnection;
    await connection.connection.close();
    await app.queue.destroy();
  });

  it('ao acessar a rota /students/:id/checkins deve exibir os checkins realizados pelo aluno', async () => {
    await Checkin.insertMany([
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
    ]);

    const response = await request(app.server).get('/students/1/checkins');
    expect(response.body).toHaveProperty('checkins');
    expect(response.body.checkins).toHaveLength(4);
  });

  it('ao acessar a rota /students/:id/checkins com vários registros então os registros precisam ser paginados', async () => {
    await Checkin.insertMany([
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
    ]);

    const response = await request(app.server).get('/students/1/checkins');
    expect(response.body.checkins).toHaveLength(10);
    expect(response.body.pagination.pages).toBe(2);

    const responsePage2 = await request(app.server).get(
      '/students/1/checkins?page=2'
    );
    expect(responsePage2.body.checkins).toHaveLength(2);
  });

  it('ao acessar rota /students/:id/checkins com metodo post deve inserir um novo checkin', async () => {
    const response = await request(app.server).post('/students/1/checkins');
    expect(response.body).toHaveProperty('student_id');
  });

  it('ao tentar realizar checkin após 7 dias mesmo com mais de 5 checkins então o checkin deve ser feito', async () => {
    MockDate.set('2019-12-01');
    await Checkin.insertMany([
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
    ]);

    MockDate.set('2019-12-20');

    const response = await request(app.server).post('/students/1/checkins');
    expect(response.body).toHaveProperty('student_id');
  });

  it('ao tentar realizar checkin mais de 5 vezes no periodo de 7 dias então deve exibir uma mensagem de erro', async () => {
    await Checkin.insertMany([
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
      {
        student_id: parseInt(1, 10),
      },
    ]);

    const response = await request(app.server).post('/students/1/checkins');
    expect(response.body.error).toBe(
      'Você não pode realizar check-in mais que 5 vezes em uma semana'
    );
  });
});
