import { ApiError } from '../../../utils/error'
import { prisma } from '../../../db'
import { category } from '../../category/service'
import { payment } from '../../payment/service'
import { transaction } from '../service'
import { buildTransactionPayments } from './buildTransactionPayments'

export async function updateTransaction(userId: number, id: number, data: UpdateTransactionDTO = {}) {
    const existing = await transaction.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('TRANSACTION_NOT_FOUND', 'Lançamento não encontrado', 404)
    }

    if (existing.transferId) {
        throw new ApiError(
            'TRANSACTION_PART_OF_TRANSFER',
            'Esta transação faz parte de uma transferência entre contas. Exclua a transferência para removê-la.',
            400,
        )
    }

    const categoryId = data.categoryId !== undefined ? Number(data.categoryId) : existing.categoryId

    if (!categoryId || isNaN(categoryId)) {
        throw new ApiError('CATEGORY_ID_REQUIRED', 'Categoria é obrigatória', 400)
    }

    if (data.categoryId !== undefined) {
        const categoryFinded = await category.findById(categoryId, userId)

        if (!categoryFinded) {
            throw new ApiError('CATEGORY_NOT_FOUND', 'Categoria não encontrada', 404)
        }
    }

    const totalAmount = data.totalAmount !== undefined ? Number(data.totalAmount) : existing.totalAmount.toNumber()

    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new ApiError('INVALID_TRANSACTION_AMOUNT', 'Valor do lançamento inválido', 400)
    }

    const description = data.description !== undefined ? data.description.trim() : existing.description

    if (!description) {
        throw new ApiError('TRANSACTION_DESCRIPTION_REQUIRED', 'Descrição do lançamento é obrigatória', 400)
    }

    const date = data.date !== undefined ? new Date(data.date) : existing.date

    if (isNaN(date.getTime())) {
        throw new ApiError('INVALID_TRANSACTION_DATE', 'Data e hora do lançamento inválidas', 400)
    }

    // Se o usuário não informou nem bankAccountId nem cardId nesta edição, mantém a forma de pagamento atual.
    const existingCardId = existing.payments[0]?.cardId ?? undefined
    const sourceProvided = data.bankAccountId !== undefined || data.cardId !== undefined
    const bankAccountId = sourceProvided ? data.bankAccountId : existingCardId ? undefined : existing.bankAccountId
    const cardId = sourceProvided ? data.cardId : existingCardId

    const paymentMethodId = data.paymentMethodId !== undefined ? data.paymentMethodId : existing.payments[0]?.paymentMethodId

    const installmentTotal = data.installmentTotal !== undefined ? data.installmentTotal : (existing.installmentTotal ?? undefined)

    // O front sempre reenvia todos os campos (mesmo os que o usuário não mexeu), então não dá pra
    // decidir o que "mudou de verdade" olhando só quais chaves vieram no body — comparamos os valores
    // efetivos com os que já estão salvos. Só quando algo que afeta as parcelas (valor, data, forma de
    // pagamento, cartão ou nº de parcelas) muda de fato é que precisamos recriar os `Payment`s.
    const paymentsStructureChanged =
        totalAmount !== existing.totalAmount.toNumber() ||
        date.getTime() !== existing.date.getTime() ||
        Number(paymentMethodId) !== existing.payments[0]?.paymentMethodId ||
        (cardId ?? null) !== (existingCardId ?? null) ||
        (installmentTotal ?? 1) !== (existing.installmentTotal ?? 1)

    // A proteção contra "mexer no que já foi pago" só faz sentido pra parcelamento no cartão: uma
    // transação em dinheiro/débito/pix tem só um Payment, que ou já nasce `PAID` (data hoje/passada)
    // ou nasce `PENDING` agendado (data futura, ver buildTransactionPayments) — em ambos os casos essa
    // edição aqui é sempre permitida, o status é só recalculado de novo a partir da nova data. O risco
    // real é desalinhar parcelas de cartão que já foram marcadas como pagas.
    const hasSettledCardInstallment = !!existingCardId && existing.payments.some((existingPayment) => existingPayment.status !== 'PENDING')

    if (paymentsStructureChanged && hasSettledCardInstallment) {
        throw new ApiError('TRANSACTION_HAS_PAID_PAYMENTS', 'Este lançamento já tem parcelas pagas e não pode mais ser editado', 400)
    }

    if (!paymentsStructureChanged) {
        // Nada que afete as parcelas mudou (só descrição/categoria, por exemplo) — não mexe nos Payments.
        return transaction.updateById(id, { categoryId, description })
    }

    const built = await buildTransactionPayments(userId, {
        paymentMethodId,
        bankAccountId,
        cardId,
        installmentTotal,
        totalAmount,
        date,
    })

    await payment.deleteMany({ transactionId: id })

    await Promise.all(
        built.payments.map((builtPayment) =>
            payment.create({
                userId,
                paymentMethodId: built.paymentMethodId,
                transactionId: id,
                cardId: builtPayment.cardId,
                amount: builtPayment.amount,
                installmentNumber: builtPayment.installmentNumber,
                status: builtPayment.status,
                dueDate: builtPayment.dueDate,
                paidAt: builtPayment.paidAt,
            }),
        ),
    )

    await transaction.updateById(id, {
        bankAccountId: built.bankAccountId,
        categoryId,
        totalAmount,
        description,
        date,
        installmentTotal: built.installmentTotal,
    })

    return id
}

export interface UpdateTransactionDTO {
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
    paymentMethodId?: number
    bankAccountId?: number
    cardId?: number
    installmentTotal?: number
}
