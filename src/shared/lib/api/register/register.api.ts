import { mainApi } from "@/shared/lib/api/api"
import { IApiResponse } from "@/shared/lib/types/api"

export async function VerifyEmail(email: string) {
    const data = await mainApi<IApiResponse<void>>('/auth/send-email-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
    return data
}

export async function ConfirmEmail(email: string, code: string) {
    const data = await mainApi<IApiResponse<void>>('/auth/confirm-email-verification', {
        method: 'POST',
        body: JSON.stringify({ email, code })
    })
    return data
}

export async function Register(data: { username: string, email: string, password: string, confirmPassword: string, firstName: string, lastName: string, phone?: string }) {
    const res = await mainApi<IApiResponse<void>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return res
}
