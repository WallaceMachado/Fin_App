
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


import { app } from '../../../../app';

let connection: Connection;
let adminToken: string;
let userId: string;


describe('Create Statement Controller', () => {
  jest.setTimeout(70000);
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const iduser = '93bcd8af-5494-4e94-b139-0583d238f366';
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

    await connection.query(`
      INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${iduser}', 'user', 'user@rentx.com', '${password}', 'now()', 'now()')
      `);
    //{ body: responseToken }
    const responseUser = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'user@rentx.com',
        password: 'user',
      });



    adminToken = response.body.token;
    userId = responseUser.body.id


  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able Create Transfer type: deposit', async () => {


   const deposit =  await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 100.00, description: 'TESTE' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });

      

    const response = await request(app)
      .post(`/api/v1/statements/transfer/93bcd8af-5494-4e94-b139-0583d238f366`)
      .send({ amount: 10.00, description: 'TESTE' })
      .set({
        authorization: `Bearer ${adminToken}`,
      });



    expect(response.status).toBe(201);


  });




});
