import Axios from 'axios'

import { getToken } from '@/lib/storage/authentication'

export default function api() {
    const token = getToken()

    const baseURL = process.env.API

    return Axios.create({
        baseURL,
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    })
}