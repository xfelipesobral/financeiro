import { prisma } from '../../../db'

export class PaymentMethodRepository {
    private paymentMethod = prisma.paymentMethod

    findMany() {
        return this.paymentMethod.findMany({
            orderBy: { name: 'asc' },
        })
    }

    findById(id: number) {
        return this.paymentMethod.findUnique({
            where: { id },
        })
    }

    findByGuid(guid: string) {
        return this.paymentMethod.findUnique({
            where: { guid },
        })
    }
}
