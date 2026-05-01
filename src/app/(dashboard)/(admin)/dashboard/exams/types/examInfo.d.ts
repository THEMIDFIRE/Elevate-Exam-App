export type ExamInfo = {
    payload: Payload;
}

export type Payload = {
    exam: Exam;
}

export type Exam = {
    id:             string;
    title:          string;
    description:    string;
    image:          string;
    duration:       number;
    diplomaId:      string;
    immutable:      boolean;
    createdAt:      Date;
    updatedAt:      Date;
    diploma:        Diploma;
    questionsCount: number;
}

export type Diploma = {
    id:          string;
    title:       string;
    description: string;
    image:       string;
}
