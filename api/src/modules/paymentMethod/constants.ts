// Lista fixa de formas de pagamento (ver seed em api/src/db/seed.ts). O guid é a chave
// estável usada pelo código para identificar cada forma de pagamento — o id numérico
// pode mudar, o guid não.
export const PAYMENT_METHOD_GUID = {
    CASH: 'dinheiro',
    DEBIT: 'debito',
    PIX: 'pix',
    CREDIT_CARD: 'cartao-credito',
    LOAN: 'emprestimo',
} as const
