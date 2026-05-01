import type { Results } from "@/shared/lib/types/results";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { mainApi } from "../api";

export type ExamAnswersType = {
    examId: string;
    answers: {
        questionId: string;
        answerId: string;
    }[];
    startedAt: string;
};

export async function submitSubmission(payload: ExamAnswersType): Promise<Results> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    return mainApi<Results>(`/submissions`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
