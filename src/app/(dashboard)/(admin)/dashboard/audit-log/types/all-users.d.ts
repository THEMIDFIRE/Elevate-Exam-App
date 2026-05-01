export type AllUsers = {
    payload: Payload;
}

export type Payload = {
    data:     Data[];
    metadata: Metadata;
}

export type Data = {
    id:            string;
    username:      string;
    email:         string;
    phone:         null | string;
    firstName:     string;
    lastName:      string;
    profilePhoto:  null | string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role:          string;
    immutable:     boolean;
    createdAt:     Date;
    updatedAt:     Date;
}

export type Metadata = {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
}
