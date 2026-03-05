import { prisma } from '../../../../db'

export default class SteamInventoryItemTransactionRepository {
    private steamInventoryItemTransaction = prisma.steamInventoryItemTransaction

    create(data: CreateSteamInventoryItemTransactionDTO) {
        return this.steamInventoryItemTransaction.create({ data })
    }
}

interface CreateSteamInventoryItemTransactionDTO {
    steamInventoryItemId: number
    observation?: string
    unitPrice: number
    quantity: number
    totalAmount: number
    categoryId: number
}
