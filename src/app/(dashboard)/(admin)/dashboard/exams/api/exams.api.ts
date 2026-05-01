import { mainApi } from "@/shared/lib/api/api";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { ExamInfo } from "../types/examInfo";
import { Exams } from "@/shared/lib/types/exams";

type NewExamPayload = {
    title: string;
    description: string;
    image: string;
    duration: number;
    diplomaId: string
}

export async function getExamInfo(id: string): Promise<ExamInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<ExamInfo>(`/exams/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

export async function addNewExam(newExam: NewExamPayload){
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Exams>(`/exams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newExam)
    })
    return res
}

type UpdateExamPayload = {
    title?: string;
    description?: string;
    image?: string;
    duration?: number;
    diplomaId?: string
}

export async function updateExam(updateExam: UpdateExamPayload, examId: string){
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<ExamInfo>(`/exams/${examId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateExam)
    })
    return res
}

interface DeleteExam {
    message: string
}

export async function delExam(examId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DeleteExam>(`/exams/${examId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res
}

interface Immutability {
    message: string
}

export async function setExamImmutability(examId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Immutability>(`/admin/exams/${examId}/immutable`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res
}