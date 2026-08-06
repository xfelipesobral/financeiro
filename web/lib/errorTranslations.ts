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

    // Conta bancária
    BANK_ID_REQUIRED: 'Banco é obrigatório',
    BRANCH_CODE_REQUIRED: 'Agência é obrigatória',
    ACCOUNT_NUMBER_REQUIRED: 'Número da conta é obrigatório',
    PIX_KEY_TYPE_REQUIRED: 'Tipo da chave Pix é obrigatório',
    PIX_KEY_VALUE_REQUIRED: 'Valor da chave Pix é obrigatório',
    BANK_ACCOUNT_ID_REQUIRED: 'Conta bancária é obrigatória',
    INVALID_BANK_ACCOUNT_ID: 'Conta bancária inválida',
    BANK_ACCOUNT_NOT_FOUND: 'Conta bancária não encontrada',
    BANK_ACCOUNT_HAS_CARDS: 'Não é possível excluir a conta: existem cartões vinculados a ela',
    BANK_ACCOUNT_HAS_TRANSACTIONS: 'Não é possível excluir a conta: existem lançamentos vinculados a ela',

    // Cartão
    CARD_NAME_REQUIRED: 'Nome do cartão é obrigatório',
    INVALID_CLOSING_DAY: 'Dia de fechamento inválido (use um valor entre 1 e 31)',
    INVALID_CARD_TYPE: 'Tipo de cartão inválido',
    INVALID_CARD_LIMIT: 'Limite do cartão inválido',
    CARD_ID_REQUIRED: 'Cartão é obrigatório',
    INVALID_CARD_ID: 'Cartão inválido',
    CARD_NOT_FOUND: 'Cartão não encontrado',

    // Lançamento (Transaction)
    CATEGORY_ID_REQUIRED: 'Categoria é obrigatória',
    CATEGORY_NOT_FOUND: 'Categoria não encontrada',
    INVALID_TRANSACTION_AMOUNT: 'Valor do lançamento inválido',
    TRANSACTION_DESCRIPTION_REQUIRED: 'Descrição do lançamento é obrigatória',
    TRANSACTION_ID_REQUIRED: 'Lançamento é obrigatório',
    INVALID_TRANSACTION_ID: 'Lançamento inválido',
    TRANSACTION_NOT_FOUND: 'Lançamento não encontrado',
    INVALID_TRANSACTION_DATE: 'Data e hora do lançamento inválidas',
    INVALID_PAGE: 'Página inválida',
    INVALID_PAGE_SIZE: 'Quantidade de itens por página inválida',
    INVALID_CATEGORY_ID: 'Categoria inválida',
    INVALID_TRANSACTION_TYPE: 'Tipo de lançamento inválido',
    INVALID_START_DATE: 'Data inicial inválida',
    INVALID_END_DATE: 'Data final inválida',
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
