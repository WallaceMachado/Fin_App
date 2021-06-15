import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "./ICreateTransferDTO";




@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, type, amount, description, recipient_id, sender_id }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const recipientUser = await this.usersRepository.findById(recipient_id);
    if (!recipientUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const senderUser = await this.usersRepository.findById(sender_id);
    if (!senderUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });
    
    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const transferCreate = await this.statementsRepository.createTransfer({
      user_id,
      recipient_id,
      sender_id: 'null',
      type,
      amount,
      description
    });

    const transferRecieve = await this.statementsRepository.receiveTransfer({
      user_id:recipient_id,
      recipient_id: 'null',
      sender_id,
      type,
      amount,
      description
    });





const statementOperation = {transferCreate, transferRecieve}

return statementOperation;
}

}

export { CreateTransferUseCase }
