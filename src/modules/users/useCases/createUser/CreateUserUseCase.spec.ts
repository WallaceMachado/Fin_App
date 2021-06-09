import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let userTest: ICreateUserDTO;

describe('Create user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  beforeAll(() => {
    userTest = {
      name: 'user test',
      email: 'user@test.com.br',
      password: '1234',
    }
  });

  it('Should be able to create new user', async () => {
    const user = await createUserUseCase.execute(userTest);
    expect(user).toHaveProperty('id');
  });


  it('Should not be able to create a user to user Already Exists', () => {
    expect(async () => {
       await createUserUseCase.execute(userTest);

       await createUserUseCase.execute(userTest);
    }).rejects.toBeInstanceOf(CreateUserError);
  });




});
