import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let statementRepository: InMemoryStatementsRepository
let userTest: ICreateUserDTO;
let createStatement: CreateStatementUseCase;

const testStatement1 = {
  user_id: '',
  amount: 100,
  description: 'Ignite',
  type: 'deposit'
} as ICreateStatementDTO;

const testStatement2 = {
  user_id: '',
  amount: 70,
  description: 'Lanche',
  type: 'withdraw'
} as ICreateStatementDTO;


describe('Get Balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepository, usersRepositoryInMemory);
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository);

  });

  beforeAll(async () => {
    userTest = {
      name: 'Wallace Teste',
      email: 'wallaceTeste@email.com',
      password: '1234',

    };


  });

  it('Should be able get Balance', async () => {
    const user = await createUserUseCase.execute(userTest);
    const user_id = user.id as string;


    testStatement1.user_id = user_id;
    testStatement2.user_id = user_id;

    await createStatement.execute(testStatement1);
    await createStatement.execute(testStatement2);
    const balance = await getBalanceUseCase.execute({ user_id: user_id });


    expect(balance).toHaveProperty('balance');
    expect(balance.statement.length).toBe(2);
    expect(balance.balance).toBe(30);
  });


  it('Should not be able to get balance of nonexistent user', () => {
    expect(async () => {

      await getBalanceUseCase.execute({ user_id: "idIncorrect" });

    }).rejects.toBeInstanceOf(GetBalanceError);
  });




});
