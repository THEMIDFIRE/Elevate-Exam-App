export type Exams = {
    payload: Payload;
}

export type Payload = {
    data:     Data[];
    metadata: Metadata;
}

export type Data = {
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
    id:    string;
    title: string;
}

export type Metadata = {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
}
