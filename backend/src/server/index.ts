import express from 'express'

import router from '../routes'
import { errorHandler } from '../middlewares/errorHandler'

export function startServer() {
    const app = express()

    app.use(express.json())

    // Carrega rotas
    app.use(router)

    // Carrega middleware de tratamento de erros
    app.use(errorHandler)

    // Por padrao, inicia na porta 3000
    const serverPort = process.env.PORT || 3000

    app.listen(serverPort, () => {
        console.log(`Server started on ${serverPort} 🟢`)
    })

    return app
}
