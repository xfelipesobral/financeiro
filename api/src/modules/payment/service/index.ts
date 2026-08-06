import { PaymentRepository } from '../repository'

export class PaymentService extends PaymentRepository {}

export const payment = new PaymentService()
