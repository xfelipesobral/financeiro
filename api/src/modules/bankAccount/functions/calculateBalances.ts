import { transaction } from '../../transaction/service'

/**
 * Calcula o saldo atual de cada conta bancária do usuário: soma de créditos menos débitos,
 * excluindo transações no cartão de crédito (ver `sumTotalAmountByBankAccount`). Retorna um Map
 * bankAccountId -> saldo; contas sem nenhuma transação simplesmente não aparecem no Map (saldo 0).
 */
export async function calculateBalances(userId: number): Promise<Map<number, number>> {
    const [credits, debits] = await Promise.all([
        transaction.sumTotalAmountByBankAccount(userId, 'CREDIT'),
        transaction.sumTotalAmountByBankAccount(userId, 'DEBIT'),
    ])

    const balances = new Map<number, number>()

    for (const { bankAccountId, _sum } of credits) {
        balances.set(bankAccountId, (balances.get(bankAccountId) ?? 0) + (_sum.totalAmount?.toNumber() ?? 0))
    }

    for (const { bankAccountId, _sum } of debits) {
        balances.set(bankAccountId, (balances.get(bankAccountId) ?? 0) - (_sum.totalAmount?.toNumber() ?? 0))
    }

    return balances
}
