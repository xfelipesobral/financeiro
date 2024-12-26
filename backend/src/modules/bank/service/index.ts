
import { BankModel } from './prisma'

export class BankService extends BankModel {
}

export const bank = new BankService()