import { prisma } from '.'

// - 55/56/58/59/60: sustentam empréstimo/fatura de cartão/transferência (ver LOAN_CATEGORY_ID,
//   LOAN_SETTLEMENT_CATEGORY_ID, CARD_INVOICE_CATEGORY_ID, TRANSFER_CATEGORY_IDS), não podem sumir.
// - 61-71: categorias base curadas, ponto de partida pro relatório geral. O usuário pode criar
//   mais categorias base além dessas (sem trava), e subcategorias à vontade dentro de qualquer uma.
const categories: { id: number; description: string; type: 'DEBIT' | 'CREDIT'; parentId?: number }[] = [
    { id: 55, description: 'Empréstimo', type: 'CREDIT' },
    { id: 56, description: 'Desconto Empréstimo', type: 'DEBIT' },
    { id: 58, description: 'Fatura Cartão de Crédito', type: 'DEBIT' },
    { id: 59, description: 'Transferência Enviada', type: 'DEBIT' },
    { id: 60, description: 'Transferência Recebida', type: 'CREDIT' },
    { id: 61, description: 'Salário', type: 'CREDIT' },
    { id: 62, description: 'Alimentação', type: 'DEBIT' },
    { id: 63, description: 'Transporte', type: 'DEBIT' },
    { id: 64, description: 'Moradia', type: 'DEBIT' },
    { id: 65, description: 'Saúde', type: 'DEBIT' },
    { id: 66, description: 'Educação', type: 'DEBIT' },
    { id: 67, description: 'Lazer', type: 'DEBIT' },
    { id: 68, description: 'Investimentos', type: 'DEBIT' },
    { id: 69, description: 'Vestuário', type: 'DEBIT' },
    { id: 70, description: 'Profissional', type: 'DEBIT' },
    { id: 71, description: 'Outros', type: 'DEBIT' },
]

const banks: { id: number; name: string; guid: string }[] = [
    { id: 1, name: 'Nubank', guid: 'nubank' },
    { id: 2, name: 'Banco Inter', guid: 'inter' },
    { id: 3, name: 'C6 Bank', guid: 'c6-bank' },
    { id: 4, name: 'Banco do Brasil', guid: 'banco-do-brasil' },
    { id: 5, name: 'Bradesco', guid: 'bradesco' },
    { id: 6, name: 'Santander', guid: 'santander' },
    { id: 7, name: 'Caixa Econômica Federal', guid: 'caixa-economica-federal' },
    { id: 8, name: 'Sicredi', guid: 'sicredi' },
    { id: 9, name: 'Itaú', guid: 'itau' },
    { id: 10, name: 'Banco Original', guid: 'banco-original' },
    { id: 11, name: 'PagBank', guid: 'pagbank' },
    { id: 12, name: 'Banco Pan', guid: 'banco-pan' },
    { id: 13, name: 'Next', guid: 'next' },
    { id: 14, name: 'BTG Pactual', guid: 'btg-pactual' },
    { id: 15, name: 'Sicoob', guid: 'sicoob' },
    { id: 16, name: 'Mercado Pago', guid: 'mercado-pago' },
    { id: 17, name: 'Neon', guid: 'neon' },
    { id: 18, name: 'Banco Safra', guid: 'banco-safra' },
    { id: 19, name: 'Banrisul', guid: 'banrisul' },
    { id: 20, name: 'Banco BMG', guid: 'banco-bmg' },
    { id: 21, name: 'Carteira', guid: 'carteira' },
]

const paymentMethods: { id: number; guid: string; name: string }[] = [
    { id: 1, guid: 'dinheiro', name: 'Dinheiro' },
    { id: 2, guid: 'debito', name: 'Débito' },
    { id: 3, guid: 'pix', name: 'Pix' },
    { id: 4, guid: 'cartao-credito', name: 'Cartão de Crédito' },
    { id: 5, guid: 'emprestimo', name: 'Empréstimo' },
    { id: 6, guid: 'transferencia', name: 'Transferência' },
]

async function seed() {
    console.log('Atualizando categorias...')
    for (const { id, description, type, parentId } of categories) {
        console.log(`Atualizando categoria ${id} - ${description}`)
        try {
            await prisma.category.upsert({
                where: { id },
                update: { description, parentId, type },
                create: { id, description, parentId, type },
            })
        } catch {
            console.log(`Erro ao atualizar categoria ${id} - ${description}`)
        }
    }

    // Criando bancos
    console.log('atualizando bancos...')
    for (const { id, guid, name } of banks) {
        console.log(`Atualizando banco ${id} - ${name}`)
        try {
            await prisma.bank.upsert({
                where: { id },
                update: { name, guid },
                create: { id, guid, name },
            })
        } catch {
            console.log(`Erro ao atualizar banco ${id} - ${name}`)
        }
    }

    // Criando formas de pagamento
    console.log('atualizando formas de pagamento...')
    for (const { id, guid, name } of paymentMethods) {
        console.log(`Atualizando forma de pagamento ${id} - ${name}`)
        try {
            await prisma.paymentMethod.upsert({
                where: { id },
                update: { guid, name },
                create: { id, guid, name },
            })
        } catch {
            console.log(`Erro ao atualizar forma de pagamento ${id} - ${name}`)
        }
    }
}

seed()
