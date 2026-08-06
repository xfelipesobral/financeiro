import { BankAccountRepository } from '../repository'

export class BankAccountService extends BankAccountRepository {}

export const bankAccount = new BankAccountService()
