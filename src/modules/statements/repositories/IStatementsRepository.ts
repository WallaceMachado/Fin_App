import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>;
  findStatementOperation: (data: IGetStatementOperationDTO) => Promise<Statement | undefined>;
  getUserBalance: (data: IGetBalanceDTO) => Promise<
    { balance: number } | { balance: number, statement: Statement[] }
  >;
   createTransfer({
    user_id,
    amount,
    description,
    type,
    recipient_id,
    sender_id
  }: ICreateTransferDTO): Promise<Statement>;

   receiveTransfer({
    user_id,
    amount,
    description,
    type,
    recipient_id,
    sender_id
  }: ICreateTransferDTO): Promise<Statement>;
}
