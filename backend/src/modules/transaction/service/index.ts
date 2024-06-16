
import { TransactionFunctionsService } from './model'
import { TransactionModel } from './prisma'

export class TransactionService extends TransactionModel implements TransactionFunctionsService {
}