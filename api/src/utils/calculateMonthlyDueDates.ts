/**
 * Calcula as datas de vencimento mensais de uma série de parcelas.
 *
 * A primeira parcela cai no `day` do mês de `fromDate` se `fromDate` ainda não
 * passou desse dia; caso contrário, cai no `day` do mês seguinte. As parcelas
 * seguintes somam +1 mês a partir da anterior. Se o mês não tiver `day` dias
 * (ex: dia 31 em fevereiro), usa o último dia do mês.
 */
export function calculateMonthlyDueDates(fromDate: Date, day: number, count: number): Date[] {
    const dates: Date[] = []
    let monthIndex = fromDate.getFullYear() * 12 + fromDate.getMonth()

    if (fromDate.getDate() > day) {
        monthIndex += 1
    }

    for (let i = 0; i < count; i++) {
        const year = Math.floor((monthIndex + i) / 12)
        const month = (monthIndex + i) % 12
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const clampedDay = Math.min(day, daysInMonth)

        dates.push(
            new Date(
                year,
                month,
                clampedDay,
                fromDate.getHours(),
                fromDate.getMinutes(),
                fromDate.getSeconds(),
                fromDate.getMilliseconds(),
            ),
        )
    }

    return dates
}

/**
 * Troca apenas o dia de `date`, mantendo o mês/ano originais. Se o mês não
 * tiver `day` dias, usa o último dia do mês. Útil para reagendar o
 * vencimento de parcelas já geradas sem alterar o mês em que caem.
 */
export function changeDayOfMonth(date: Date, day: number): Date {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const clampedDay = Math.min(day, daysInMonth)

    return new Date(date.getFullYear(), date.getMonth(), clampedDay, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
}

/**
 * Calcula as datas de vencimento de uma série de parcelas de fatura de cartão, respeitando
 * fechamento e vencimento como dias distintos: a parcela cai na fatura que fecha em `closingDay`
 * (mesma lógica de rollover de `calculateMonthlyDueDates`, aplicada sobre `closingDay`), e o
 * vencimento dessa fatura é em `dueDay` — no mesmo mês do fechamento se `dueDay > closingDay`
 * (ex: fecha dia 4, vence dia 10), ou no mês seguinte caso contrário (ex: fecha dia 25, vence dia 5).
 */
export function calculateCardInvoiceDueDates(fromDate: Date, closingDay: number, dueDay: number, count: number): Date[] {
    const closingDates = calculateMonthlyDueDates(fromDate, closingDay, count)
    const monthOffset = dueDay > closingDay ? 0 : 1

    return closingDates.map((closingDate) => {
        const monthIndex = closingDate.getFullYear() * 12 + closingDate.getMonth() + monthOffset
        const year = Math.floor(monthIndex / 12)
        const month = monthIndex % 12
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const clampedDay = Math.min(dueDay, daysInMonth)

        return new Date(
            year,
            month,
            clampedDay,
            closingDate.getHours(),
            closingDate.getMinutes(),
            closingDate.getSeconds(),
            closingDate.getMilliseconds(),
        )
    })
}
