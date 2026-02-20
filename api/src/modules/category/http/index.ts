import { FastifyInstance } from 'fastify'
import { find } from './find'

export async function userRoutes(app: FastifyInstance) {
    app.get('/', find)
}

// import { Router } from 'express'

// import { find } from './find'

// const categoryRoutes = Router()

// categoryRoutes.get('/', find)
// categoryRoutes.get('/:id', find)

// export { categoryRoutes }
