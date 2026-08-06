import { Prisma } from '../../../../prisma/generated/client'

type CardWithBankAccount = Prisma.CardGetPayload<{ include: { bankAccount: { include: { bank: true } } } }>

export function formatCard(card: CardWithBankAccount) {
    return {
        ...card,
        limit: card.limit.toNumber(),
    }
}
