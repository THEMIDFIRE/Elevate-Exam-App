export type DiplomaInfo = {
    payload: Payload;
}

export type Payload = {
    diploma: Diploma;
}

export type Diploma = {
    id:          string;
    title:       string;
    description: string;
    image:       string;
    immutable:   boolean;
    createdAt:   Date;
    updatedAt:   Date;
    exams:       Exam[];
}

export type Exam = {
    id:             string;
    title:          string;
    description:    string;
    image:          string;
    duration:       number;
    createdAt:      Date;
    questionsCount: number;
}
