export type QuestionInfo = {
    payload: Payload;
}

export type Payload = {
    question: Question;
}

export type Question = {
    id:        string;
    text:      string;
    examId:    string;
    immutable: boolean;
    createdAt: Date;
    updatedAt: Date;
    exam:      Exam;
    answers:   Answer[];
}

export type Answer = {
    id:   string;
    text: string;
}

export type Exam = {
    id:    string;
    title: string;
}