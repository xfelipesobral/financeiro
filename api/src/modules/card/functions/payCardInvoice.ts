import { ApiError } from '../../../utils/error'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { paymentMethod } from '../../paymentMethod/service'
import { PAYMENT_METHOD_GUID } from '../../paymentMethod/constants'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { card } from '../service'
import { CARD_INVOICE_CATEGORY_ID } from '../constants'

export async function payCardInvoice(userId: number, cardId: number, data: PayCardInvoiceDTO = {}) {
    const bankAccountId = Number(data.bankAccountId)
    const dueDate = data.dueDate === undefined ? null : new Date(data.dueDate)
    const paidAt = data.paidAt === undefined ? new Date() : new Date(data.paidAt)

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
    }

    if (!dueDate || isNaN(dueDate.getTime())) {
        throw new ApiError('DUE_DATE_REQUIRED', 'Data de vencimento da fatura é obrigatória', 400)
    }

    if (isNaN(paidAt.getTime())) {
        throw new ApiError('INVALID_PAID_AT', 'Data de pagamento inválida', 400)
    }

    const cardFinded = await card.userFindById(userId, cardId)

    if (!cardFinded) {
        throw new ApiError('CARD_NOT_FOUND', 'Cartão não encontrado', 404)
    }

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
    }

    // Todas as parcelas pendentes desse cartão com esse vencimento exato = a fatura sendo paga.
    const pendingPayments = await payment.findManyPendingByCardIdAndDueDate(cardId, dueDate)

    if (!pendingPayments.length) {
        throw new ApiError('CARD_INVOICE_NOT_FOUND', 'Não há parcelas pendentes para esse cartão nesse vencimento', 404)
    }

    const invoiceCategory = await category.findById(CARD_INVOICE_CATEGORY_ID, userId)

    if (!invoiceCategory) {
        throw new ApiError('CARD_INVOICE_CATEGORY_NOT_CONFIGURED', 'Categoria padrão de fatura de cartão não configurada', 500)
    }

    const debitPaymentMethod = await paymentMethod.findByGuid(PAYMENT_METHOD_GUID.DEBIT)

    if (!debitPaymentMethod) {
        throw new ApiError('DEBIT_PAYMENT_METHOD_NOT_CONFIGURED', 'Forma de pagamento padrão de débito não configurada', 500)
    }

    const totalAmount = pendingPayments.reduce((sum, currentPayment) => sum + currentPayment.amount.toNumber(), 0)
    const description = `Fatura ${cardFinded.name}`

    // Transaction sem cardId no seu Payment: é essa (e só essa) que entra no cálculo de saldo da
    // conta bancária (ver sumTotalAmountByBankAccount) — a compra original, com cardId, já é
    // excluída do saldo desde que foi lançada.
    const createdTransaction = await transaction.create(userId, bankAccountId, CARD_INVOICE_CATEGORY_ID, totalAmount, description, paidAt, null)

    await payment.create({
        userId,
        paymentMethodId: debitPaymentMethod.id,
        transactionId: createdTransaction.id,
        amount: totalAmount,
        status: 'PAID',
        dueDate,
        paidAt,
    })

    await Promise.all(pendingPayments.map((currentPayment) => payment.updateById(currentPayment.id, { status: 'PAID', paidAt })))

    return (await transaction.userFindById(userId, createdTransaction.id))!
}

export interface PayCardInvoiceDTO {
    bankAccountId?: number
    dueDate?: string
    paidAt?: string
}
