
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

  it('Should be able Create Statement type: deposit', async () => {


    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 100.00, description: 'TESTE' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });


    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('id');
  });

  it('Should be able Create Statement type: withdraw', async () => {


    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 90.00, description: 'teste' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });

    
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('id');
  });


  it('Should not be able to withdraw more than what user currently have in balance', async () => {


    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 90.00, description: 'withdraw' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });


    expect(response.status).toBe(400);


  });



});
