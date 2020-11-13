import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from  '../repositories/TransactionsRepository';


class DeleteTransactionService {
  public async execute(id : string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    
    const transaction = await transactionsRepository.findOne(id);

    if(!transaction){
      throw new AppError('Transactions not exists', 204);
    }

    await transactionsRepository.remove(transaction);
    return;
  }
}

export default DeleteTransactionService;
