import { PaymentMethodRepository } from '../repository'

export class PaymentMethodService extends PaymentMethodRepository {}

export const paymentMethod = new PaymentMethodService()
