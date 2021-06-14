
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


import { app } from '../../../../app';

let connection: Connection;
let adminToken: string;


describe('Create Statement Controller', () => {
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

  it('Should be able to get statement operation of a user', async () => {


    await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 100.00, description: 'TESTE' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });

    const { body: statement } = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 90.00, description: 'teste' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });


    const response = await request(app)
      .get(`/api/v1/statements/${statement.id}`)
      .send()
      .set({
        authorization: `Bearer ${adminToken}`,
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.amount).toBe('90.00');
  });

  
});
