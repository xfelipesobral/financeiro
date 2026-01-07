
import { BankAccountModel } from './prisma'

export class BankAccountService extends BankAccountModel {
}

export const bankAccount = new BankAccountService()