'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { delAuditlog, getAuditLogInfo } from '../api/audit-log.api'
import { Button } from '@/shared/components/ui/button'
import { ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AUditlogInfo({ role }: { role: string }) {
    const params = useSearchParams()
    const auditLogId = params.get('auditlog') as string

    const router = useRouter()

    const { data: logInfo } = useQuery({
        queryKey: ['auditLogInfo'],
        queryFn: () => getAuditLogInfo(auditLogId)
    })

    const { mutate: deleteLog } = useMutation({
        mutationFn: async (auditLogId: string) => {
            const res = await delAuditlog(auditLogId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
            router.push('/dashboard/exams')
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

const action = logInfo?.payload.auditLog.action
const entityType = logInfo?.payload.auditLog.entityType
const entityId = logInfo?.payload.auditLog.entityId
const method = logInfo?.payload.auditLog.httpMethod
const createdAt = logInfo?.payload.auditLog.createdAt
const username = logInfo?.payload.auditLog.actorUsername
const email = logInfo?.payload.auditLog.actorEmail
const ip = logInfo?.payload.auditLog.ipAddress
const updatedFields = logInfo?.payload.auditLog.metadata?.keys
const metadata = logInfo?.payload.auditLog.metadata

const formatAuditCreatedAt = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return { time: '-', date: '-' }

    const time = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(date)

    const day = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date)

    return { time, date: day }
}


return (
    <>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='text-lg font-semibold capitalize'>{`${entityType} ${logInfo?.payload.auditLog.action.toLowerCase()} by ${logInfo?.payload.auditLog.actorUsername}`}</h3>
                <div className='flex items-center text-xs'>
                    <span>Entity: </span>
                    <Link href={`
                                    ${entityType === 'question' ?
                            `/dashboard/exams/exam-info?examId=${logInfo?.payload.auditLog?.metadata?.examId}` :
                            `/dashboard/${entityType}s/${logInfo?.payload.auditLog.metadata?.title}?${entityType}Id=${entityId}`
                        }`} className='text-sm text-gray-400 flex gap-1.5 items-center'>
                        {entityId} <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
            {role === 'SUPER ADMIN' && <div>
                <Button variant={"destructive"}
                onClick={() => deleteLog(auditLogId)}
                    className="px-4 rounded-none">
                    <Trash2 /> Delete
                </Button>
            </div>}
        </div>
        <div className='mt-7 [&_.title]:text-xs [&_.title]:text-gray-400 space-y-4 *:space-y-0.5'>
            <div>
                <p className='title'>Action</p>
                <p className={`text-sm font-bold
                    ${action === 'UPDATE' && 'text-yellow-600'} 
                    ${action === 'CREATE' && 'text-emerald-600'} 
                    ${action === 'DELETE' && 'text-red-600'} `}>
                    {action}
                </p>
            </div>
            <div>
                <p className='title'>Method</p>
                <p>{method}</p>
            </div>
            <div>
                <p className="title">User</p>
                <p>{username}</p>
                <p className='title'>Email: {email}</p>
                <p className='title'>IP Address: {ip}</p>
                <p className='title'>Role: <span className='text-red-600'>{role}</span></p>
            </div>
            <div>
                <p className="title">Entity</p>
                <div className="flex items-center">
                    <p className='text-gray-800 capitalize'>{entityType}:</p>
                    <Link href={`${entityType === 'question' ?
                        `/dashboard/exams/exam-info?examId=${logInfo?.payload.auditLog?.metadata?.examId}` :
                        `/dashboard/${entityType}s/${logInfo?.payload.auditLog.metadata?.title}?${entityType}Id=${entityId}`
                        }`} className='text-sm text-gray-400 flex items-center gap-1.5'>
                        {entityId} <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
            <div>
                <p className="title">Date & Time</p>
                <div>
                    {(() => {
                        const { time, date } = formatAuditCreatedAt(createdAt as unknown as Date | string)
                        return (
                            <p className="text-sm">{time} | {date}</p>
                        )
                    })()}
                </div>
            </div>
            <div>
                <p className="title">Updated Fields</p>
                <p>{updatedFields?.join(', ')}</p>
            </div>
            <div>
                <p className="title">Metadata</p>
                {metadata?.title && <p>&quot;title&quot;:&quot;{metadata.title}&quot;</p>}
                {metadata?.description && <p>&quot;description&quot;:&quot;{metadata.description}&quot;</p>}
            </div>
        </div>
    </>
)
}
