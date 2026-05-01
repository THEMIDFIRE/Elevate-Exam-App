import { mainApi } from "@/shared/lib/api/api"
import { IApiResponse } from "@/shared/lib/types/api"

export async function ForgotPassword(email: string) {
    const res = await mainApi<IApiResponse<void>>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
    return res
}