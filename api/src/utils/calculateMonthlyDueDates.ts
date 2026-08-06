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
