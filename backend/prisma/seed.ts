import { PrismaClient } from '@prisma/client'
import { passwordToHash } from '../src/utils/password'

const prisma = new PrismaClient()

const banks = ['Nubank', 'Sicredi']

const categories: { description: string, type: 'DEBIT' | 'CREDIT' }[] = [
    { description: 'Alimentação', type: 'DEBIT' },
    { description: 'Assinaturas', type: 'DEBIT' },
    { description: 'Diversos', type: 'DEBIT' },
    { description: 'Jogos', type: 'DEBIT' },
    { description: 'Investimentos', type: 'DEBIT' },
    { description: 'Salário', type: 'CREDIT' },
    { description: 'Dentista', type: 'DEBIT' },
    { description: 'Saúde', type: 'DEBIT' },
    { description: 'Transporte', type: 'DEBIT' },
    { description: 'Educação', type: 'DEBIT' },
    { description: 'Roupas', type: 'DEBIT' },
    { description: 'Casa', type: 'DEBIT' },
    { description: 'Mercado', type: 'DEBIT' },
    { description: 'Lazer', type: 'DEBIT' },
    { description: 'Viagem', type: 'DEBIT' },
    { description: 'Presente', type: 'DEBIT' },
    { description: 'Transferência', type: 'CREDIT' }
]

async function main() {
    await prisma.user.upsert({
        where: { email: 'contato@felipesobral.com.br' },
        update: {},
        create: {
            id: 'felipesobral',
            email: 'contato@felipesobral.com.br',
            name: 'Felipe V. Sobral',
            password: await passwordToHash('admin')
        }
    })

    let id = 0
    for (const { description, type } of categories) {
        id++
        await prisma.category.upsert({
            where: { id },
            update: { description, type },
            create: { id, description, type }
        })
    }

    id = 0
    for (const name of banks) {
        id++
        await prisma.bank.upsert({
            where: { id },
            update: { name },
            create: { id, name }
        })
    }

    console.log('Seed completed ✅')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })

