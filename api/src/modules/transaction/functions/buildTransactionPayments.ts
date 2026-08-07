import { ApiError } from '../../../utils/error'
import { PaymentStatus } from '../../../../prisma/generated/enums'
import { bankAccount } from '../../bankAccount/service'
import { card } from '../../card/service'
import { paymentMethod } from '../../paymentMethod/service'
import { PAYMENT_METHOD_GUID } from '../../paymentMethod/constants'
import { calculateCardInvoiceDueDates, startOfDay } from '../../../utils/calculateMonthlyDueDates'
import { splitAmountIntoInstallments } from '../../../utils/splitAmountIntoInstallments'

export interface BuildTransactionPaymentsInput {
    paymentMethodId?: number
    bankAccountId?: number
    cardId?: number
    installmentTotal?: number
    totalAmount: number
    date: Date
}

export interface BuiltTransactionPayment {
    amount: number
    installmentNumber: number | null
    status: PaymentStatus
    dueDate: Date
    paidAt: Date | null
    cardId: number | null
}

export interface BuiltTransactionPayments {
    bankAccountId: number
    paymentMethodId: number
    installmentTotal: number | null
    payments: BuiltTransactionPayment[]
}

/**
 * Valida o meio de pagamento de uma transação e monta as parcelas (`Payment`)
 * correspondentes. O meio de pagamento escolhido (`paymentMethod.guid`) é quem
 * decide o caminho, não um campo separado:
 * - Cartão de crédito (guid `cartao-credito`): N parcelas `PENDING`, com vencimento
 *   calculado a partir do fechamento e do vencimento da fatura do cartão (`closingDay`/`dueDay`).
 * - Qualquer outro (dinheiro, débito, pix, ...) com `date` futura: 1 parcela `PENDING`
 *   (agendada) — fica de fora do saldo da conta (ver `sumTotalAmountByBankAccount`) até o
 *   usuário dar o aceite em `acceptScheduledPayment`.
 * - Qualquer outro com `date` hoje/passada: 1 parcela já `PAID` na hora, usando a conta
 *   bancária informada — comportamento de sempre, sem agendamento.
 */
export async function buildTransactionPayments(userId: number, input: BuildTransactionPaymentsInput): Promise<BuiltTransactionPayments> {
    const paymentMethodId = Number(input.paymentMethodId)

    if (!input.paymentMethodId || isNaN(paymentMethodId)) {
        throw new ApiError('PAYMENT_METHOD_ID_REQUIRED', 'Forma de pagamento é obrigatória', 400)
    }

    const paymentMethodFinded = await paymentMethod.findById(paymentMethodId)

    if (!paymentMethodFinded) {
        throw new ApiError('PAYMENT_METHOD_NOT_FOUND', 'Forma de pagamento não encontrada', 404)
    }

    const isCreditCard = paymentMethodFinded.guid === PAYMENT_METHOD_GUID.CREDIT_CARD

    if (!isCreditCard) {
        const bankAccountId = Number(input.bankAccountId)

        if (!input.bankAccountId || isNaN(bankAccountId)) {
            throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
        }

        const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

        if (!bankAccountFinded) {
            throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
        }

        // Data futura = lançamento agendado: fica PENDING (fora do saldo) até o aceite. Comparação
        // por dia (startOfDay), não por instante — agendar "hoje mais cedo" não deve virar pendente.
        const isScheduled = startOfDay(input.date) > startOfDay(new Date())

        return {
            bankAccountId,
            paymentMethodId,
            installmentTotal: null,
            payments: [
                {
                    amount: input.totalAmount,
                    installmentNumber: null,
                    status: isScheduled ? 'PENDING' : 'PAID',
                    dueDate: input.date,
                    paidAt: isScheduled ? null : new Date(),
                    cardId: null,
                },
            ],
        }
    }

    const cardId = Number(input.cardId)

    if (!input.cardId || isNaN(cardId)) {
        throw new ApiError('CARD_ID_REQUIRED', 'Cartão é obrigatório', 400)
    }

    const cardFinded = await card.userFindById(userId, cardId)

    if (!cardFinded) {
        throw new ApiError('CARD_NOT_FOUND', 'Cartão não encontrado', 404)
    }

    const installmentTotal = input.installmentTotal === undefined ? 1 : Number(input.installmentTotal)

    if (isNaN(installmentTotal) || installmentTotal < 1 || !Number.isInteger(installmentTotal)) {
        throw new ApiError('INVALID_INSTALLMENT_TOTAL', 'Número de parcelas inválido', 400)
    }

    const dueDates = calculateCardInvoiceDueDates(input.date, cardFinded.closingDay, cardFinded.dueDay, installmentTotal)
    const amounts = splitAmountIntoInstallments(input.totalAmount, installmentTotal)
    const isInstallment = installmentTotal > 1

    return {
        bankAccountId: cardFinded.bankAccountId,
        paymentMethodId,
        installmentTotal: isInstallment ? installmentTotal : null,
        payments: amounts.map((amount, index) => ({
            amount,
            installmentNumber: isInstallment ? index + 1 : null,
            status: 'PENDING' as PaymentStatus,
            dueDate: dueDates[index],
            paidAt: null,
            cardId,
        })),
    }
}
