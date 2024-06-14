import { PrismaClient } from '@prisma/client'
import { passwordToHash } from '../src/utils/password'

const prisma = new PrismaClient()

const banks = ['Nubank', 'Sicredi']
const categories = ['Alimentação', 'Assinaturas', 'Diversos', 'Jogos', 'FFI', 'Ação', 'RDB', 'Salário']

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
    for (const description of categories) {
        id++
        await prisma.category.upsert({
            where: { id },
            update: { description },
            create: { id, description }
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

