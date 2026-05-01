import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { mainApi } from "../api";
import { IApiResponse } from "@/shared/lib/types/api";

export async function ChangeInfo(data: { firstName: string; lastName: string; profilePhoto?: string | null | undefined; phone?: string | null | undefined; }) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<IApiResponse<void>>('/users/profile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function ChangePass(data: { currentPassword: string; newPassword: string; ConfirmPassword?: string; }) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<IApiResponse<void>>('/users/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function ConfirmNewEmail(newEmail: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<IApiResponse<void>>('/users/email/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail })
    })
    return res
}

export async function ConfirmOTP(code: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<IApiResponse<void>>('/users/email/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
    })
    return await res
}
export async function DeleteAcc() {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<IApiResponse<void>>('/users/account', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    return await res
}