'use server'

import api from '..'

interface NewTransaction {
    amount: number
    bankId: number
    categoryId: number
    date: string
    description: string
}

const errorTranslations: { [key: string]: string } = {
    'Amount is required and must be greater than zero': 'Valor é obrigatório e deve ser maior que zero',
    'Description is required': 'Descrição é obrigatória',
    'Bank and category are required': 'Banco e categoria são obrigatórios',
    'Category not found': 'Categoria não encontrada',
    'Bank not found': 'Banco não encontrado',
    'Transaction not found': 'Transação não encontrada'
}

export async function newTransaction(transaction: NewTransaction): Promise<string> {
    try {
        const response = await api().post('/transaction', transaction)

        if (response.data?.id) {
            return ''
        }

        throw new Error('Id não encontrado')
    } catch (e) {
        const { response: { data: { message } } } = e as ResponseError
        return errorTranslations[message || ''] || 'Erro inesperado, tente novamente mais tarde'
    }
}