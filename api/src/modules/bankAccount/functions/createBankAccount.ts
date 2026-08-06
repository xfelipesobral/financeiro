import { ApiError } from '../../../utils/error'
import { bank } from '../../bank/service'
import { bankAccount } from '../service'

export async function createBankAccount(userId: number, data: CreateBankAccountDTO = {}) {
    const bankId = Number(data.bankId)
    const branchCode = data.branchCode?.trim()
    const accountNumber = data.accountNumber?.trim()
    const description = data.description?.trim()
    const pixKeys = normalizePixKeys(data.pixKeys)

    if (!data.bankId || isNaN(bankId)) {
        throw new ApiError('BANK_ID_REQUIRED', 'Banco é obrigatório', 400)
    }

    if (!branchCode) {
        throw new ApiError('BRANCH_CODE_REQUIRED', 'Agência é obrigatória', 400)
    }

    if (!accountNumber) {
        throw new ApiError('ACCOUNT_NUMBER_REQUIRED', 'Número da conta é obrigatório', 400)
    }

    const bankFinded = await bank.findById(bankId)

    if (!bankFinded) {
        throw new ApiError('BANK_NOT_FOUND', 'Banco não encontrado', 404)
    }

    const createdBankAccount = await bankAccount.create(userId, bankId, branchCode, accountNumber, description)

    if (pixKeys.length) {
        await bankAccount.createPixKeys(createdBankAccount.id, pixKeys)
    }

    const result = await bankAccount.userFindById(userId, createdBankAccount.id)

    return result!
}

function normalizePixKeys(pixKeys: CreateBankAccountDTO['pixKeys']) {
    if (!pixKeys || !Array.isArray(pixKeys)) return []

    return pixKeys.map((pixKey, index) => {
        const type = pixKey?.type?.trim()
        const value = pixKey?.value?.trim()

        if (!type) {
            throw new ApiError('PIX_KEY_TYPE_REQUIRED', `Chave Pix #${index + 1}: tipo é obrigatório`, 400)
        }

        if (!value) {
            throw new ApiError('PIX_KEY_VALUE_REQUIRED', `Chave Pix #${index + 1}: valor é obrigatório`, 400)
        }

        return { type, value }
    })
}

export interface CreateBankAccountDTO {
    bankId?: number
    branchCode?: string
    accountNumber?: string
    description?: string
    pixKeys?: { type?: string; value?: string }[]
}
