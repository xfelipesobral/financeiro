import { FastifyInstance } from 'fastify'

import { userRoutes } from '../modules/user/http'
import { categoryRoutes } from '../modules/category/http'
import { bankRoutes } from '../modules/bank/http'
import { bankAccountRoutes } from '../modules/bankAccount/http'
import { cardRoutes } from '../modules/card/http'
import { loanRoutes } from '../modules/loan/http'
import { transferRoutes } from '../modules/transfer/http'
import { paymentMethodRoutes } from '../modules/paymentMethod/http'
import { paymentRoutes } from '../modules/payment/http'
import { transactionRoutes } from '../modules/transaction/http'
import { steamItemRoutes } from '../modules/steamInventory/item/http'
import { steamItemTransactionRoutes } from '../modules/steamInventory/itemTransaction/http'

export default async function router(app: FastifyInstance) {
    app.get('/', async () => {
        return {
            mensagem: 'API Financeiro ONLINE 🟢',
        }
    })

    await app.register(userRoutes, { prefix: '/user' })
    await app.register(categoryRoutes, { prefix: '/category' })
    await app.register(bankRoutes, { prefix: '/bank' })
    await app.register(bankAccountRoutes, { prefix: '/bank-account' })
    await app.register(cardRoutes, { prefix: '/card' })
    await app.register(loanRoutes, { prefix: '/loan' })
    await app.register(transferRoutes, { prefix: '/transfer' })
    await app.register(paymentMethodRoutes, { prefix: '/payment-method' })
    await app.register(paymentRoutes, { prefix: '/payment' })
    await app.register(transactionRoutes, { prefix: '/transaction' })
    await app.register(steamItemRoutes, { prefix: '/steam/itens' })
    await app.register(steamItemTransactionRoutes, { prefix: '/steam/transactions' })
}
