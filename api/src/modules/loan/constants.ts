// Categoria fixa seedada para representar a baixa de parcela de empréstimo com desembolso real de
// uma conta bancária (ver api/src/db/seed.ts). Usada pela Transaction de débito criada em
// settleLoanInstallments.ts quando o usuário confirma quais parcelas pagou.
export const LOAN_SETTLEMENT_CATEGORY_ID = 56 // 'Desconto Empréstimo' (DEBIT)
