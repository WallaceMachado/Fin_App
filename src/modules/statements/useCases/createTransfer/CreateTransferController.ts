import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";



enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {

    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { recipient_id } = request.params;


    const splittedPath = request.originalUrl.split('/')
     const type = splittedPath[splittedPath.length - 2] as OperationType;


    const createTransfer = container.resolve(CreateTransferUseCase);


    const statement = await createTransfer.execute({
      user_id,
      sender_id: user_id,
      recipient_id,
      type,
      amount,
      description,

    });



    return response.status(201).json(statement);
  }
}


