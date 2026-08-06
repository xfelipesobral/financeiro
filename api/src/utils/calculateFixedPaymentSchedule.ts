const MAX_MONTHS = 1200 // 100 anos, limite de segurança contra loop infinito

export type FixedPaymentScheduleResult =
    | { ok: true; amounts: number[] }
    | { ok: false; reason: 'INSUFFICIENT_MONTHLY_PAYMENT' }

/**
 * Simula a quitação de uma dívida pagando um valor fixo por mês, com juros
 * compostos incidindo sobre o saldo devedor a cada período: a cada mês o saldo
 * cresce pela taxa e o pagamento abate o que der, até zerar. A última parcela
 * fecha só com o que resta do saldo (por isso costuma ser menor que as demais).
 *
 * Retorna a lista de valores de cada parcela (a soma delas é o total realmente
 * pago, incluindo juros). Se `monthlyPayment` não cobrir nem os juros do
 * primeiro mês, a dívida nunca seria quitada e o resultado indica isso.
 */
export function calculateFixedPaymentSchedule(principal: number, monthlyRatePercent: number, monthlyPayment: number): FixedPaymentScheduleResult {
    const monthlyRate = monthlyRatePercent / 100

    if (monthlyPayment <= principal * monthlyRate) {
        return { ok: false, reason: 'INSUFFICIENT_MONTHLY_PAYMENT' }
    }

    let balance = principal
    let months = 0
    const amounts: number[] = []

    while (balance > 0.005 && months < MAX_MONTHS) {
        months++
        balance += balance * monthlyRate
        const installment = Math.round(Math.min(monthlyPayment, balance) * 100) / 100
        balance -= installment
        amounts.push(installment)
    }

    if (balance > 0.005) {
        return { ok: false, reason: 'INSUFFICIENT_MONTHLY_PAYMENT' }
    }

    return { ok: true, amounts }
}
