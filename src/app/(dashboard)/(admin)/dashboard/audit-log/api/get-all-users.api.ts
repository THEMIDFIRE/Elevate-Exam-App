import { mainApi } from "@/shared/lib/api/api";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { AllUsers } from "../types/all-users";

export async function getAllUsers({ search }: { search?: string }){
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<AllUsers>(`/admin/users?page=1&limit=20&search=${search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}