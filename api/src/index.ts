import 'dotenv/config'

import { startServer } from './server'

// Inicia servico
const app = startServer(parseInt(process.env?.PORT || '3001'))

export default app
