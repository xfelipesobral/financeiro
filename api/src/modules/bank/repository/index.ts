import { prisma } from '../../../db'

export class BankRepository {
    private bank = prisma.bank

    findMany() {
        return this.bank.findMany({
            orderBy: { name: 'asc' },
        })
    }

    findById(id: number) {
        return this.bank.findUnique({
            where: { id },
        })
    }
}
