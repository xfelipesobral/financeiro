import Axios from 'axios'

import { getToken } from '@/lib/storage/authentication'

export default async function api() {
    const token = await getToken()

    const baseURL = process.env.API

    return Axios.create({
        baseURL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    })
}
