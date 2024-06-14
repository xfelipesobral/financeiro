import { config as configDotEnv } from 'dotenv'

import { startServer } from './server'

configDotEnv()

const app = startServer()

export default app