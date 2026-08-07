import { ApiError } from '../../../utils/error'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { paymentMethod } from '../../paymentMethod/service'
import { PAYMENT_METHOD_GUID } from '../../paymentMethod/constants'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { transfer } from '../service'
import { TRANSFER_CATEGORY_IDS } from '../../category/constants'

export async function createTransfer(userId: number, data: CreateTransferDTO = {}) {
    const fromBankAccountId = Number(data.fromBankAccountId)
    const toBankAccountId = Number(data.toBankAccountId)
    const amount = data.amount === undefined ? NaN : Number(data.amount)
    const description = data.description?.trim()
    const date = data.date === undefined ? new Date() : new Date(data.date)

    if (!data.fromBankAccountId || isNaN(fromBankAccountId)) {
        throw new ApiError('FROM_BANK_ACCOUNT_ID_REQUIRED', 'Conta de origem é obrigatória', 400)
    }

    if (!data.toBankAccountId || isNaN(toBankAccountId)) {
        throw new ApiError('TO_BANK_ACCOUNT_ID_REQUIRED', 'Conta de destino é obrigatória', 400)
    }

    if (fromBankAccountId === toBankAccountId) {
        throw new ApiError('TRANSFER_SAME_BANK_ACCOUNT', 'A conta de origem e de destino não podem ser a mesma', 400)
    }

    if (isNaN(amount) || amount <= 0) {
        throw new ApiError('INVALID_TRANSFER_AMOUNT', 'Valor da transferência inválido', 400)
    }

    if (!description) {
        throw new ApiError('TRANSFER_DESCRIPTION_REQUIRED', 'Descrição da transferência é obrigatória', 400)
    }

    if (isNaN(date.getTime())) {
        throw new ApiError('INVALID_TRANSFER_DATE', 'Data da transferência inválida', 400)
    }

    const fromBankAccountFinded = await bankAccount.userFindById(userId, fromBankAccountId)

    if (!fromBankAccountFinded) {
        throw new ApiError('FROM_BANK_ACCOUNT_NOT_FOUND', 'Conta de origem não encontrada', 404)
    }

    const toBankAccountFinded = await bankAccount.userFindById(userId, toBankAccountId)

    if (!toBankAccountFinded) {
        throw new ApiError('TO_BANK_ACCOUNT_NOT_FOUND', 'Conta de destino não encontrada', 404)
    }

    const sentCategory = await category.findById(TRANSFER_CATEGORY_IDS.SENT, userId)
    const receivedCategory = await category.findById(TRANSFER_CATEGORY_IDS.RECEIVED, userId)

    if (!sentCategory || !receivedCategory) {
        throw new ApiError('TRANSFER_CATEGORY_NOT_CONFIGURED', 'Categorias padrão de transferência não configuradas', 500)
    }

    const transferPaymentMethod = await paymentMethod.findByGuid(PAYMENT_METHOD_GUID.TRANSFER)

    if (!transferPaymentMethod) {
        throw new ApiError('TRANSFER_PAYMENT_METHOD_NOT_CONFIGURED', 'Forma de pagamento padrão de transferência não configurada', 500)
    }

    const createdTransfer = await transfer.create(userId, fromBankAccountId, toBankAccountId, amount, description, date)

    // Perna de saída: débito na conta origem.
    const debitTransaction = await transaction.create(userId, fromBankAccountId, TRANSFER_CATEGORY_IDS.SENT, amount, description, date, null)

    // Perna de entrada: crédito na conta destino.
    const creditTransaction = await transaction.create(userId, toBankAccountId, TRANSFER_CATEGORY_IDS.RECEIVED, amount, description, date, null)

    await Promise.all([
        transaction.updateById(debitTransaction.id, { transferId: createdTransfer.id }),
        transaction.updateById(creditTransaction.id, { transferId: createdTransfer.id }),
    ])

    // Transferência é sempre imediata: as duas pernas já nascem pagas, sem parcelas futuras.
    await Promise.all([
        payment.create({
            userId,
            paymentMethodId: transferPaymentMethod.id,
            transactionId: debitTransaction.id,
            amount,
            status: 'PAID',
            dueDate: date,
            paidAt: date,
        }),
        payment.create({
            userId,
            paymentMethodId: transferPaymentMethod.id,
            transactionId: creditTransaction.id,
            amount,
            status: 'PAID',
            dueDate: date,
            paidAt: date,
        }),
    ])

    return (await transfer.userFindById(userId, createdTransfer.id))!
}

export interface CreateTransferDTO {
    fromBankAccountId?: number
    toBankAccountId?: number
    amount?: number
    description?: string
    date?: string
}
