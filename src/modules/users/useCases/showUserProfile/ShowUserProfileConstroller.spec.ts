
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


import { app } from '../../../../app';

let connection: Connection;
let adminToken: string;


describe('Show UserProfile Controller', () => {
  jest.setTimeout(70000);
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('admin', 8);

    await connection.query(`
    INSERT INTO USERS(id, name, email, password, created_at, updated_at)
    values('${id}', 'admin', 'admin@rentx.com', '${password}', 'now()', 'now()')
    `);
    //{ body: responseToken }
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin@rentx.com',
        password: 'admin',
      });



    adminToken = response.body.token;


  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to  user', async () => {


    const retornoProfile = await request(app)
      .get('/api/v1/profile')
      .send()
      .set({
        authorization: `Bearer ${adminToken}`,
      });


    expect(retornoProfile.status).toBe(200);

    expect(retornoProfile.body).toHaveProperty('id');
  });

  it('Should not be able to show user Profile a user to do not Exists', async () => {


    const retornoProfile = await request(app)
      .get('/api/v1/profile')
      .send()
      .set({
        authorization: `Bearer ${'incorrect'}`,
      });


    expect(retornoProfile.status).toBe(401);


  });


});
