import { TransactionRepository } from '../repository'

export class TransactionService extends TransactionRepository {}

export const transaction = new TransactionService()
