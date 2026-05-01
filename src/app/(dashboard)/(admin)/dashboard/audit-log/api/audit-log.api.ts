import { mainApi } from "@/shared/lib/api/api";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { AuditLogTypes } from "../types/audit-log";
import { AuditlogInfo } from "../types/audit-log-info";

export async function getAuditLogs(limit: number, page: number, category?: string, action?: string, actorUserId?: string, sortBy?: string, sortOrder?: string, search?: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<AuditLogTypes>(`/admin/audit-logs?limit=${20}&page=${page}${category ? `&category=${category}` : ''}${action ? `&action=${action}` : ''}${actorUserId ? `&actorUserId=${actorUserId}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

export async function getAuditLogInfo(auditlogId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<AuditlogInfo>(`/admin/audit-logs/${auditlogId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

interface DeleteLog {
    message: string
}

export async function delAuditlog(auditlogId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DeleteLog>(`/admin/audit-logs/${auditlogId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}

export async function ClearAll() {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DeleteLog>(`/admin/audit-logs`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}
