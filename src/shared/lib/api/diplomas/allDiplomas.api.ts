import { Diplomas } from "../../types/diplomas";
import { getNextAuthToken } from "../../util/auth.util";
import { mainApi } from "../api";

export async function getDiplomas(limit: number, page?: number, sortBy?: string, sortOrder?: string, search?: string, immutabilityFilter?: boolean | null) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Diplomas>(`/diplomas?limit=${limit}${page ? `&page=${page}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}${search ? `&search=${search}` : ''}${immutabilityFilter !== undefined && immutabilityFilter !== null ? `&immutable=${immutabilityFilter}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}
