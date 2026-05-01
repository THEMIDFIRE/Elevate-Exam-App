import axios from "axios"
import { getNextAuthToken } from "../util/auth.util"

const baseURL = process.env.NEXT_PUBLIC_API_URL!

export async function mainApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(baseURL + endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options,
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'API request failed')
    }
    return await res.json()
}


const ServerAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL!,
});


ServerAPI.interceptors.request.use(async (config) => {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;
    
    if (token) {
        config.headers.token = token;
    }
    return config
},
    (error) => {
        return Promise.reject(error)
    }
)

export default ServerAPI;