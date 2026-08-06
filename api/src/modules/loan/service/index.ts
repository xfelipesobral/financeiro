import { LoanRepository } from '../repository'

export class LoanService extends LoanRepository {}

export const loan = new LoanService()
