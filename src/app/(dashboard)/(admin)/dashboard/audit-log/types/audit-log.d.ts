import { ActionsFilter, CategoryFilter } from "@/shared/lib/types/sort";

export type AuditLogTypes = {
    status:  boolean;
    code:    number;
    payload: Payload;
}

export type Payload = {
    data:     Data[];
    metadata: PayloadMetadata;
}

export type Data = {
    id:            string;
    createdAt:     Date;
    actorUserId:   string;
    actorUsername: string;
    actorEmail:    string;
    actorRole:     string;
    category:      CategoryFilter;
    action:        ActionsFilter;
    entityType:    string;
    entityId:      string;
    metadata:      Metadata | null;
    ipAddress:     string;
    userAgent:     string;
    httpMethod:    HttpMethod;
    path:          string;
}

export type HttpMethod = "DELETE" | "POST" | "PUT";

export type Metadata = {
    title:      string;
    diplomaId?: string;
    examId?:    string;
    keys?:      string[];
}

export type PayloadMetadata = {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
}
