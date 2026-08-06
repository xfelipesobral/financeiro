import { ApiError } from '../../../utils/error'
import { bank } from '../../bank/service'
import { bankAccount } from '../service'

export async function updateBankAccount(userId: number, id: number, data: UpdateBankAccountDTO = {}) {
    const existing = await bankAccount.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
    }

    const updateData: { bankId?: number; branchCode?: string; accountNumber?: string; description?: string | null } = {}

    if (data.bankId !== undefined) {
        const bankId = Number(data.bankId)

        if (isNaN(bankId)) {
            throw new ApiError('BANK_ID_REQUIRED', 'Banco é obrigatório', 400)
        }

        const bankFinded = await bank.findById(bankId)

        if (!bankFinded) {
            throw new ApiError('BANK_NOT_FOUND', 'Banco não encontrado', 404)
        }

        updateData.bankId = bankId
    }

    if (data.branchCode !== undefined) {
        const branchCode = data.branchCode.trim()

        if (!branchCode) {
            throw new ApiError('BRANCH_CODE_REQUIRED', 'Agência é obrigatória', 400)
        }

        updateData.branchCode = branchCode
    }

    if (data.accountNumber !== undefined) {
        const accountNumber = data.accountNumber.trim()

        if (!accountNumber) {
            throw new ApiError('ACCOUNT_NUMBER_REQUIRED', 'Número da conta é obrigatório', 400)
        }

        updateData.accountNumber = accountNumber
    }

    if (data.description !== undefined) {
        updateData.description = data.description.trim() || null
    }

    await bankAccount.updateById(id, updateData)

    if (data.pixKeys !== undefined) {
        const pixKeys = normalizePixKeys(data.pixKeys)

        await bankAccount.deletePixKeysByBankAccountId(id)

        if (pixKeys.length) {
            await bankAccount.createPixKeys(id, pixKeys)
        }
    }

    const result = await bankAccount.userFindById(userId, id)

    return result!
}

function normalizePixKeys(pixKeys: UpdateBankAccountDTO['pixKeys']) {
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

export interface UpdateBankAccountDTO {
    bankId?: number
    branchCode?: string
    accountNumber?: string
    description?: string
    pixKeys?: { type?: string; value?: string }[]
}
