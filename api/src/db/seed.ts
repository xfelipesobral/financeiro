import { prisma } from '.'

async function seed() {
    console.log('Criando categorias...')
    try {
        await prisma.category.createMany({
            data: [
                { id: 1, description: 'Steam', type: 'DEBIT' },
                { id: 2, description: 'Compra Item Steam', type: 'DEBIT', parentId: 1 },
                { id: 3, description: 'Venda Item Steam', type: 'CREDIT', parentId: 1 },
                { id: 4, description: 'Salário', type: 'CREDIT' },
                { id: 5, description: 'Alimentação', type: 'DEBIT' },
                { id: 6, description: 'Restaurante', type: 'DEBIT', parentId: 5 },
                { id: 7, description: 'Mercado', type: 'DEBIT', parentId: 5 },
                { id: 8, description: 'Delivery', type: 'DEBIT', parentId: 5 },
                { id: 9, description: 'Transporte', type: 'DEBIT' },
                { id: 10, description: 'Combustível', type: 'DEBIT', parentId: 9 },
                { id: 11, description: 'Uber / Táxi', type: 'DEBIT', parentId: 9 },
                { id: 12, description: 'Transporte Público', type: 'DEBIT', parentId: 9 },
                { id: 13, description: 'Moradia', type: 'DEBIT' },
                { id: 14, description: 'Aluguel', type: 'DEBIT', parentId: 13 },
                { id: 15, description: 'Condomínio', type: 'DEBIT', parentId: 13 },
                { id: 16, description: 'Conta de Luz', type: 'DEBIT', parentId: 13 },
                { id: 17, description: 'Conta de Água', type: 'DEBIT', parentId: 13 },
                { id: 18, description: 'Internet', type: 'DEBIT', parentId: 13 },
                { id: 19, description: 'Saúde', type: 'DEBIT' },
                { id: 20, description: 'Plano de Saúde', type: 'DEBIT', parentId: 19 },
                { id: 21, description: 'Farmácia', type: 'DEBIT', parentId: 19 },
                { id: 22, description: 'Consulta Médica', type: 'DEBIT', parentId: 19 },
                { id: 23, description: 'Educação', type: 'DEBIT' },
                { id: 24, description: 'Curso / Faculdade', type: 'DEBIT', parentId: 23 },
                { id: 25, description: 'Livros', type: 'DEBIT', parentId: 23 },
                { id: 26, description: 'Lazer', type: 'DEBIT' },
                { id: 27, description: 'Cinema / Streaming', type: 'DEBIT', parentId: 26 },
                { id: 28, description: 'Viagem', type: 'DEBIT', parentId: 26 },
                { id: 29, description: 'Vestuário', type: 'DEBIT' },
                { id: 30, description: 'Roupas', type: 'DEBIT', parentId: 29 },
                { id: 31, description: 'Calçados', type: 'DEBIT', parentId: 29 },
                { id: 32, description: 'Investimentos', type: 'DEBIT' },
                { id: 33, description: 'Renda Variável', type: 'DEBIT', parentId: 32 },
                { id: 34, description: 'Renda Fixa', type: 'DEBIT', parentId: 32 },
                { id: 35, description: 'Rendimento Investimento', type: 'CREDIT' },
                { id: 36, description: 'Dividendos', type: 'CREDIT', parentId: 35 },
                { id: 37, description: 'Juros', type: 'CREDIT', parentId: 35 },
                { id: 38, description: 'Renda Extra', type: 'CREDIT' },
                { id: 39, description: 'Freelance', type: 'CREDIT', parentId: 38 },
                { id: 40, description: 'Cashback', type: 'CREDIT', parentId: 38 },
                { id: 41, description: 'Presente / Doação', type: 'CREDIT', parentId: 38 },
                { id: 42, description: 'Pets', type: 'DEBIT' },
                { id: 43, description: 'Veterinário', type: 'DEBIT', parentId: 42 },
                { id: 44, description: 'Ração / Acessórios', type: 'DEBIT', parentId: 42 },
                { id: 45, description: 'Assinaturas', type: 'DEBIT' },
                { id: 46, description: 'Streaming', type: 'DEBIT', parentId: 45 },
                { id: 47, description: 'Software / SaaS', type: 'DEBIT', parentId: 45 },
                { id: 48, description: 'Impostos / Taxas', type: 'DEBIT' },
                { id: 49, description: 'IPTU', type: 'DEBIT', parentId: 48 },
                { id: 50, description: 'IPVA', type: 'DEBIT', parentId: 48 },
                { id: 51, description: 'Outros', type: 'DEBIT' },
            ],
        })
    } catch {
        console.log('Categorias já existem. Pulando etapa de criação.')
    }

    // Criando bancos
    console.log('Criando bancos...')
    try {
        await prisma.bank.createMany({
            data: [
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
            ],
        })
    } catch {
        console.log('Bancos já existem. Pulando etapa de criação.')
    }
}

seed()
