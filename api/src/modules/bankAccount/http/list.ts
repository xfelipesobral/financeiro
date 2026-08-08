import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { bankAccount } from '../service'
import { calculateBalances } from '../functions/calculateBalances'

interface Query {
    includeBalance?: string
}

// `calculateBalances` varre todas as transações do usuário (groupBy sobre a tabela inteira) — pesado
// em contas com muito histórico. Telas que só precisam do nome/descrição das contas (selects de
// formulário, por exemplo) podem pedir `includeBalance=false` pra pular esse cálculo.
export async function list(request: FastifyRequest<{ Querystring: Query }>, reply: FastifyReply) {
    try {
        const userId = request.authenticated!.userId
        const includeBalance = request.query.includeBalance !== 'false'

        const [bankAccounts, balances] = await Promise.all([
            bankAccount.userFindMany(userId),
            includeBalance ? calculateBalances(userId) : Promise.resolve(new Map<number, number>()),
        ])

        reply.status(200).send(bankAccounts.map((currentBankAccount) => ({ ...currentBankAccount, balance: balances.get(currentBankAccount.id) ?? 0 })))
    } catch (error) {
        handleApiError(error, reply)
    }
}
