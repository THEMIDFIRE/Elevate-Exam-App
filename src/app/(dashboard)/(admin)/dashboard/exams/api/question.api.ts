import { mainApi } from "@/shared/lib/api/api";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { QuestionInfo } from "../types/questionInfo";

export async function getQuestionInfo(questionId: string): Promise<QuestionInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<QuestionInfo>(`/questions/${questionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

export async function addQuestionBulk(examId: string): Promise<QuestionInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<QuestionInfo>(`/questions/exam/${examId}/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

type QuestionAnswerPayload = {
    text: string,
    isCorrect: boolean
}

type AddSingleQuestionPayload = {
    text: string,
    examId: string | null,
    answers: QuestionAnswerPayload[]
}

type UpdateSingleQuestionPayload = {
    text: string,
    answers: QuestionAnswerPayload[]
}

export async function addSingleQuestion(newQuestions: AddSingleQuestionPayload): Promise<QuestionInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<QuestionInfo>(`/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestions)
    })
    return res
}

export async function updateQuestion(newQuestions: UpdateSingleQuestionPayload, questionId: string): Promise<QuestionInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<QuestionInfo>(`/questions/${questionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestions)
    })
    return res
}

type BulkQuestionPayload = {
    questions: {
        text: string,
        answers: {
            text: string,
            isCorrect: boolean
        }[]
    }[]
}

export async function addBulkQuestions( examId: string , newQuestions: BulkQuestionPayload): Promise<QuestionInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<QuestionInfo>(`/questions/exam/${examId}/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestions)
    })
    return res
}

interface DeleteExam {
    message: string
}

export async function delQuestion(questionId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DeleteExam>(`/questions/${questionId}`, {
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

export async function setQuestionImmutability(questionId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Immutability>(`/admin/questions/${questionId}/immutable`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res
}