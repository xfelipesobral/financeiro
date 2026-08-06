/**
 * Divide um valor total em `count` parcelas iguais (2 casas decimais).
 * A diferença de arredondamento é ajustada na última parcela, para que a
 * soma das parcelas bata exatamente com `totalAmount`.
 */
export function splitAmountIntoInstallments(totalAmount: number, count: number): number[] {
    if (count <= 0) {
        return []
    }

    const baseAmount = Math.floor((totalAmount / count) * 100) / 100
    const amounts = new Array(count).fill(baseAmount)

    const sumWithoutLast = baseAmount * (count - 1)
    amounts[count - 1] = Math.round((totalAmount - sumWithoutLast) * 100) / 100

    return amounts
}
