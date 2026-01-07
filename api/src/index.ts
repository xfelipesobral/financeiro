import { config as configDotEnv } from 'dotenv'

import { startServer } from './server'

// Carrega as variaveis de ambiente
configDotEnv()

// Inicia servico
const app = startServer()

export default app