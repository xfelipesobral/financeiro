
import Axios from 'axios'

export default function api() {
    return Axios.create({
        baseURL: process.env.API
    })
}