import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map((item) => ((
      item.recipient_id ? (
        {
          id: item.id,
          recipient_id: item.recipient_id,
          amount: Number(item.amount),
          description: item.description,
          type: item.type,
          created_at: item.created_at,
          updated_at: item.updated_at
        })
        :
        (item.sender_id ? ({
          id: item.id,
          recipient_id: item.recipient_id,
          amount: Number(item.amount),
          description: item.description,
          type: item.type,
          created_at: item.created_at,
          updated_at: item.updated_at
        })
          :
          ({
            id: item.id,
            amount: Number(item.amount),
            description: item.description,
            type: item.type,
            created_at: item.created_at,
            updated_at: item.updated_at
          })
        )
      )
    ));

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
