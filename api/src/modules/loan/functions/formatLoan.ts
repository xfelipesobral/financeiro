import { Prisma } from '../../../../prisma/generated/client'

type LoanWithRelations = Prisma.LoanGetPayload<{
    include: { bankAccount: { include: { bank: true } }; payments: true }
}>

export function formatLoan(loan: LoanWithRelations) {
    return {
        ...loan,
        totalAmount: loan.totalAmount.toNumber(),
        interestRate: loan.interestRate?.toNumber() ?? null,
        payments: loan.payments.map((loanPayment) => ({
            ...loanPayment,
            amount: loanPayment.amount.toNumber(),
        })),
    }
}
