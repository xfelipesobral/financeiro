import { BankRepository } from '../repository'

export class BankService extends BankRepository {}

export const bank = new BankService()
