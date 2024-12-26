
import { TransactionModel } from './prisma'

export class TransactionService extends TransactionModel {
}

export const transaction = new TransactionService()