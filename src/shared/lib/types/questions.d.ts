export type Questions = {
    payload: Payload;
}

export type Payload = {
    questions: Question[];
}

export type Question = {
    id: string;
    text: string;
    examId: string;
    answers: Answers[];
}

export type Answers = {
    id:   string;
    text: string;
}
