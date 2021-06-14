

import request from 'supertest';
import { Connection, createConnection } from 'typeorm';


import { app } from '../../../../app';

let connection: Connection;


describe('Create User Controller', () => {
  jest.setTimeout(70000);
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();


  });

  afterAll(async () => {
    await connection.dropDatabase();
     await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '1234',
      })


    expect(response.status).toBe(201);
  });

  it('Should not be able to create a user to user Already Exists', async () => {

      const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '1234',
      })

      expect(response.status).toBe(400);
  });


});
