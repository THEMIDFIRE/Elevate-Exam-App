export type AuditlogInfo = {
    status: boolean;
    code: number;
    payload: Payload;
}

export type Payload = {
    auditLog: AuditLog;
}

export type AuditLog = {
    id: string;
    createdAt: Date;
    actorUserId: string;
    actorUsername: string;
    actorEmail: string;
    actorRole: string;
    category: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata: Metadata | null;
    ipAddress: string;
    userAgent: string;
    httpMethod: string;
    path: string;
}

export type Metadata = {
    keys:        string[];
    title:       string;
    description: string;
    diplomaId:   string;
    count:       number;
    examId:      string;
    questionIds: string[];
    answerCount: number;
    textChanged: boolean;
    answersReplaced: boolean;
}