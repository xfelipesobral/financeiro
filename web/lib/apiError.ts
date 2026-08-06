import { AxiosError } from 'axios'

const DEFAULT_ERROR_MESSAGE = 'Erro inesperado, tente novamente mais tarde'

export function getApiErrorMessage(err: unknown, fallback: string = DEFAULT_ERROR_MESSAGE): string {
    if (err instanceof AxiosError) {
        return err.response?.data?.error?.message || fallback
    }

    return fallback
}
