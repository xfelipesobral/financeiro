import 'dotenv/config'
import { PrismaClient, Prisma } from '../../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prismaPg = new PrismaClient({ adapter })

const client = globalThis as unknown as { prisma: PrismaClient }

export const prisma = client.prisma || prismaPg
export { Prisma }

if (!client.prisma) {
    client.prisma = prismaPg
}
