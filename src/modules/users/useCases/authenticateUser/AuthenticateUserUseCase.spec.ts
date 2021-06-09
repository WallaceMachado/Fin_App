import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  //executado antes do teste
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate user', async () => {
    const user: ICreateUserDTO = {
      name: 'Wallace',
      email: 'wallace@email.com',
      password: '1234',

    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });



    //espera que no retorno tenha um objeto com a propriedade token
    expect(result).toHaveProperty('token');
  });


  it('Should not be able to authenticate nonexistent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'nonexistent@email.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('Should not be able to authenticate user with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Wallace',
        email: 'wallace@email.com',
        password: '1234',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});
