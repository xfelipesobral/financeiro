// Ids fixos das categorias protegidas pelo sistema (seedadas globalmente, userId sempre null — ver
// api/src/db/seed.ts). Protegidas significa: `updateCategory`/`removeCategory` só permitem
// editar/excluir uma categoria que seja sua (`existing.userId === userId`), então nenhuma delas é
// editável/excluível por ninguém — sem precisar checar nenhum desses ids em lugar nenhum do CRUD de
// categoria, essa checagem só existe aqui, nos módulos que precisam saber qual categoria usar ao
// criar uma transação automática.

export const LOAN_CATEGORY_ID = 55 // 'Empréstimo' (CREDIT) — desembolso do empréstimo
export const LOAN_SETTLEMENT_CATEGORY_ID = 56 // 'Desconto Empréstimo' (DEBIT) — baixa de parcela com débito real
export const CARD_INVOICE_CATEGORY_ID = 58 // 'Fatura Cartão de Crédito' (DEBIT) — pagamento de fatura

export const TRANSFER_CATEGORY_IDS = {
    SENT: 59, // 'Transferência Enviada' (DEBIT) — perna de saída, lançada na conta origem
    RECEIVED: 60, // 'Transferência Recebida' (CREDIT) — perna de entrada, lançada na conta destino
} as const

export const STEAM_CATEGORY_ID = 1 // 'Steam' (DEBIT) — categoria base, pai das duas abaixo
export const CATEGORY_BOUGHT_STEAM_ITEM = 2 // 'Compra Item Steam' (DEBIT)
export const CATEGORY_SOLD_STEAM_ITEM = 3 // 'Venda Item Steam' (CREDIT)
