import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoryReposityory = getRepository(Category);
    
    let transactionCategory = await categoryReposityory.findOne({ where: { title: category } });
    
    if(!transactionCategory ){ // se categoria não existir
       transactionCategory = categoryReposityory.create({ title: category });
      await categoryReposityory.save(transactionCategory);
    }
    
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if(type === "outcome"){
      const checkValue = await transactionsRepository.getBalance();
      if (value > checkValue.total){
        throw new AppError('Money insuficcients', 400);
      }
    }

    const transaction = transactionsRepository.create({ title, value, type, category: transactionCategory});

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
