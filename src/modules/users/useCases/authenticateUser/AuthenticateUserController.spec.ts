
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';


import { app } from '../../../../app';

let connection: Connection;


describe('Authenticate User Controller', () => {
  jest.setTimeout(70000);
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();


  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to authenticate user', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '1234',
      });



    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'teste@teste.com',
        password: '1234',
      });


    expect(response.status).toBe(200);
    //expect(response.body.length).toBe(1);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to authenticate nonexistent user', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '1234',
      });



    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'nonexistent@email.com',
        password: '1234',
      });

    expect(response.status).toBe(401);

  });


  it('Should not be able to authenticate user with incorrect password', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '1234',
      });



    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'teste@teste.com',
        password: 'incorrect',
      });

    expect(response.status).toBe(401);
  });

 


});
