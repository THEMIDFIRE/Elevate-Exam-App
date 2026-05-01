import { mainApi } from "@/shared/lib/api/api"
import { IApiResponse } from "@/shared/lib/types/api"

export async function ResetPassword(data: { token: string, newPassword: string, confirmPassword: string }) {
    const res = await mainApi<IApiResponse<void>>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return res
}