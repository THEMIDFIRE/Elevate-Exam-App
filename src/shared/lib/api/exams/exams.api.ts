import { Exams } from "@/shared/lib/types/exams";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { mainApi } from "../api";

export async function getExams(limit: number, page?: number, diplomaId?: string | null, sortBy?: string, sortOrder?: string, search?: string, immutabilityFilter?: boolean | null): Promise<Exams> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Exams>(`/exams?limit=${limit}${page ? `&page=${page}` : ''}${diplomaId ? `&diplomaId=${diplomaId}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}${search ? `&search=${search}` : ''}${immutabilityFilter !== undefined && immutabilityFilter !== null ? `&immutable=${immutabilityFilter}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}