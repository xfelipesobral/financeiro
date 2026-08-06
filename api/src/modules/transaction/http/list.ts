import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { CategoryType } from '../../../../prisma/generated/enums'
import { transaction } from '../service'
import { formatTransaction } from '../functions/formatTransaction'

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const TRANSACTION_TYPES: CategoryType[] = ['DEBIT', 'CREDIT']

interface Query {
    page?: string
    pageSize?: string
    categoryId?: string
    type?: string
    startDate?: string
    endDate?: string
}

export async function list(request: FastifyRequest<{ Querystring: Query }>, reply: FastifyReply) {
    try {
        const { page: pageQuery, pageSize: pageSizeQuery, categoryId: categoryIdQuery, type, startDate: startDateQuery, endDate: endDateQuery } =
            request.query

        const page = pageQuery ? Number(pageQuery) : 1
        const pageSize = pageSizeQuery ? Number(pageSizeQuery) : DEFAULT_PAGE_SIZE

        if (isNaN(page) || page < 1) {
            throw new ApiError('INVALID_PAGE', 'Página inválida', 400)
        }

        if (isNaN(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
            throw new ApiError('INVALID_PAGE_SIZE', `Quantidade de itens por página deve ser um número entre 1 e ${MAX_PAGE_SIZE}`, 400)
        }

        let categoryId: number | undefined

        if (categoryIdQuery) {
            categoryId = Number(categoryIdQuery)

            if (isNaN(categoryId)) {
                throw new ApiError('INVALID_CATEGORY_ID', 'Categoria inválida', 400)
            }
        }

        if (type && !TRANSACTION_TYPES.includes(type as CategoryType)) {
            throw new ApiError('INVALID_TRANSACTION_TYPE', 'Tipo de lançamento inválido', 400)
        }

        let startDate: Date | undefined
        let endDate: Date | undefined

        if (startDateQuery) {
            startDate = new Date(startDateQuery)

            if (isNaN(startDate.getTime())) {
                throw new ApiError('INVALID_START_DATE', 'Data inicial inválida', 400)
            }
        }

        if (endDateQuery) {
            endDate = new Date(endDateQuery)

            if (isNaN(endDate.getTime())) {
                throw new ApiError('INVALID_END_DATE', 'Data final inválida', 400)
            }
        }

        const filters = {
            categoryId,
            type: type as CategoryType | undefined,
            startDate,
            endDate,
        }

        const userId = request.authenticated!.userId

        const [transactions, total] = await Promise.all([
            transaction.userFindMany(userId, filters, { page, pageSize }),
            transaction.userCount(userId, filters),
        ])

        reply.status(200).send({
            data: transactions.map(formatTransaction),
            total,
            page,
            pageSize,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
