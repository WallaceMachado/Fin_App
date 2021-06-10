import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";





let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementRepository: InMemoryStatementsRepository
let userTest: ICreateUserDTO;
let createStatement: CreateStatementUseCase;

const sampleStatement1 = {
  user_id: '',
  amount: 800,
  description: 'teste',
  type: 'deposit'
} as ICreateStatementDTO;

const sampleStatement2 = {
  user_id: '',
  amount: 100,
  description: 'teste',
  type: 'withdraw'
} as ICreateStatementDTO;



describe('Create Statement', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepository = new InMemoryStatementsRepository();
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository);

  });

  userTest = {
    name: 'Wallace Teste',
    email: 'wallaceTeste@email.com',
    password: '1234',

  };



  it('Should be able Create Statement ', async () => {
    const user = await createUserUseCase.execute(userTest);
    const user_id = user.id as string;


    sampleStatement1.user_id = user_id;
    sampleStatement2.user_id = user_id;

    await createStatement.execute(sampleStatement1);

    const statementOperation = await createStatement.execute(sampleStatement1);


    expect(statementOperation).toHaveProperty('id');

  });


  it('Should not be able to create statement of nonexistent user', () => {
    expect(async () => {
      await createStatement.execute(sampleStatement2);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it('Should not be able to withdraw more than what user currently have in balance', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'José',
        email: 'jose@email.com',
        password: '1234'
      });

      const id = user.id as string;

      sampleStatement2.user_id= id as string;

      await createStatement.execute(sampleStatement2);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
  });





