import { AxiosError } from 'axios'

export const errorTranslations: Record<string, string> = {
    INVALID_CREDENTIALS: 'Email ou senha inválidos',
    REQUIRED_FIELDS_MISSING: 'Email e senha são obrigatórios',
    INTERNAL_SERVER_ERROR: 'Erro inesperado, tente novamente mais tarde',
    UNKNOWN_ERROR: 'Erro inesperado, tente novamente mais tarde',
    BANK_NOT_FOUND: 'Banco não encontrado',
    ERROR_CREATING_BANK_ACCOUNT: 'Erro ao criar conta de banco',
}

export function translateErrorCode(code: string = 'UNKNOWN_ERROR'): string {
    code = code.toUpperCase()
    return errorTranslations[code] || 'Erro inesperado, tente novamente mais tarde'
}

export function translateErrorCodeApi(err: unknown): string {
    console.log(err)
    const code = (err as AxiosError<ResponseError>)?.response?.data?.error?.code || 'UNKNOWN_ERROR'
    return translateErrorCode(code)
}
