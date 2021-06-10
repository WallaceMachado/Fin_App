import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let statementRepository: InMemoryStatementsRepository
let userTest: ICreateUserDTO;
let createStatement: CreateStatementUseCase;

const testStatement1 = {
  user_id: '',
  amount: 1000,
  description: 'teste',
  type: 'deposit'
} as ICreateStatementDTO;

const testStatement2 = {
  user_id: '',
  amount: 200,
  description: 'teste',
  type: 'withdraw'
} as ICreateStatementDTO;

const testUser = {
  name: 'teste',
  email: 'teste@email.com',
  password: '1234'
} as ICreateUserDTO;




describe('Operation', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepository);
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository);

  });

  beforeAll(async () => {
    userTest = {
      name: 'Wallace Teste',
      email: 'wallaceTeste@email.com',
      password: '1234',

    };


  });

  it('Should be able to get statement operation of a user', async () => {
    const user = await createUserUseCase.execute(userTest);
    const user_id = user.id as string;


    testStatement1.user_id = user_id;


    const statement = await createStatement.execute(testStatement1);

    const statement_id = statement.id as String;

    const statementOperation = await getStatementOperationUseCase.execute({ user_id, statement_id: statement_id as string });

    expect(statementOperation).toHaveProperty('id');

  });




  it('Should not be able to get nonexistent statement operation', () => {
    expect(async () => {

      //const { id: user_id } = await createUserUseCase.execute(userTest);
      const user_id = testStatement1.user_id;
      await getStatementOperationUseCase.execute({
        user_id: user_id as string,
        statement_id: 'nonexistent_statement_id'
      });



    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });


  it('Should not be able to get statement of nonexistent user', () => {
    expect(async () => {
      userTest = {
        name: 'Wallace Tes',
        email: 'wallaceTes@email.com',
        password: '1234',

      };
      const user = await createUserUseCase.execute(userTest);
      const user_id = user.id as string;
      testStatement1.user_id = user_id;
      const statement = await createStatement.execute(testStatement1);
      const statement_id = statement.id as String;
      await getStatementOperationUseCase.execute({ user_id: "idIncorrect", statement_id: statement_id as string });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

});
