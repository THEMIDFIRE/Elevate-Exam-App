import { UserInfo } from "../../types/user";
import { getNextAuthToken } from "../../util/auth.util";
import { mainApi } from "../api";

export async function getUserProfile() {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<UserInfo>(`/users/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}