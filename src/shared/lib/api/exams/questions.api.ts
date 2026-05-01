import { Questions } from "@/shared/lib/types/questions";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { mainApi } from "../api";

export async function getQuestions(examId: string, sortBy?: string, sortOrder?: string): Promise<Questions> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Questions>(`/questions/exam/${examId}?${sortBy ? `sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}