import { AxiosError } from 'axios'

export const errorTranslations: Record<string, string> = {
    INVALID_CREDENTIALS: 'Email ou senha inválidos',
    REQUIRED_FIELDS_MISSING: 'Email e senha são obrigatórios',
    INTERNAL_SERVER_ERROR: 'Erro inesperado, tente novamente mais tarde',
    UNKNOWN_ERROR: 'Erro inesperado, tente novamente mais tarde',
    BANK_NOT_FOUND: 'Banco não encontrado',
    ERROR_CREATING_BANK_ACCOUNT: 'Erro ao criar conta de banco',
    ITEM_NAME_REQUIRED: 'Nome do item é obrigatório',
    MARKET_HASH_NAME_REQUIRED: 'Market hash name é obrigatório',
    ITEM_IMAGE_URL_REQUIRED: 'Link da imagem é obrigatório',
    INVALID_ITEM_IMAGE_URL: 'Link da imagem inválido',
    INVALID_INITIAL_PAID_PRICE: 'Valor pago inicial inválido',
}

export function translateErrorCode(code: string = 'UNKNOWN_ERROR'): string {
    code = code.toUpperCase()
    return errorTranslations[code] || 'Erro inesperado, tente novamente mais tarde'
}

export function translateErrorCodeApi(err: unknown): string {
    if (err instanceof AxiosError) {
        const code = err.response?.data?.error?.code || 'UNKNOWN_ERROR'
        return translateErrorCode(code)
    }

    if (err instanceof Error) {
        const code = (err as any).code || 'UNKNOWN_ERROR'
        return translateErrorCode(code)
    }

    return translateErrorCode('UNKNOWN_ERROR')
}
