// Categorias fixas seedadas para representar as duas pernas de uma transferência entre contas do
// próprio usuário (ver api/src/db/seed.ts). Servem para: (1) montar as duas Transactions em
// createTransfer.ts, e (2) permitir excluir transferências de relatórios de gasto/receita futuros
// por id, já que elas não são gasto nem receita real.
export const TRANSFER_CATEGORY_IDS = {
    SENT: 59, // 'Transferência Enviada' (DEBIT) — perna de saída, lançada na conta origem
    RECEIVED: 60, // 'Transferência Recebida' (CREDIT) — perna de entrada, lançada na conta destino
} as const
