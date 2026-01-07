import { PaymentModel } from './prisma'

export class PaymentService extends PaymentModel {
}

export const payment = new PaymentService()