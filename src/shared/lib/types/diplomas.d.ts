export type Diplomas = {
    payload: Payload;
}

export type Payload = {
    data:     Data[];
    metadata: Metadata;
}

export type Data = {
    id:          string;
    title:       string;
    description: string;
    image:       string;
    immutable:   boolean;
    createdAt:   Date;
    updatedAt:   Date;
}

export type Metadata = {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
}
