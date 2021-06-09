import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let userTest: ICreateUserDTO;
let showUserProfileUserCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUserCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  beforeAll(async () => {
    userTest = {
      name: 'Wallace Teste',
      email: 'wallaceTeste@email.com',
      password: '1234',

    };


  });

  it('Should be able to show UserProfile', async () => {
    const user = await createUserUseCase.execute(userTest);
    const user_id = user.id as string;
    const userProfile = await showUserProfileUserCase.execute(user_id);


    expect(userProfile).toHaveProperty('id');
  });


  it('Should not be able to show user Profile a user to do not Exists', () => {
    expect(async () => {
      
      await showUserProfileUserCase.execute("idIncorrect");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });




});
