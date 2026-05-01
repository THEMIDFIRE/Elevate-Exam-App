import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { SortBy, SortOrder } from '@/shared/lib/types/sort'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, EllipsisVertical, ExternalLink, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AuditLogTypes } from '../types/audit-log'
import TableSkeleten from './table-skeleton'
import { useMutation } from '@tanstack/react-query'
import { delAuditlog } from '../api/audit-log.api'
import { toast } from 'sonner'

type AuditLogTableProps = {
    auditLogs?: AuditLogTypes
    sortBy: SortBy
    sortOrder: SortOrder
    onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void
    isLoading: boolean
    role: string
}
export default function AuditLogDataTable({ auditLogs, sortBy, sortOrder, onSortChange, isLoading, role }: AuditLogTableProps) {
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

    const { mutate: deleteLog } = useMutation({
        mutationFn: async (auditLogId: string) => {
            const res = await delAuditlog(auditLogId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    return (
        <>
            <div className="*:grid *:grid-cols-[15%_1fr_1fr_1fr_8%] *:items-center *:gap-2.5 mt-4 *:p-2 p-2">
                <div className="bg-blue-600 text-white">
                    <div>Action</div>
                    <div>User</div>
                    <div>Entity</div>
                    <div>Time</div>
                    <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                Sort <ArrowDownWideNarrow />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="[&_div]:text-sm [&_span]:text-[10px] [&_span]:text-gray-500 [&_div]:hover:bg-gray-300/80">
                                <DropdownMenuItem onClick={() => onSortChange('action', 'desc')}
                                    className={`${sortBy === 'action' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <ArrowDownAZ /> Action <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('action', 'asc')}
                                    className={`${sortBy === 'action' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <ArrowUpAZ /> Action <span>(ascending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('user', 'desc')}
                                    className={`${sortBy === 'user' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <ArrowDownAZ /> User <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('user', 'asc')}
                                    className={`${sortBy === 'user' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <ArrowUpAZ /> User <span>(ascending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('entity', 'desc')}
                                    className={`${sortBy === 'entity' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <ArrowDownAZ /> Entity <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('entity', 'asc')}
                                    className={`${sortBy === 'entity' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <ArrowUpAZ /> Entity <span>(ascending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('createdAt', 'desc')}
                                    className={`${sortBy === 'createdAt' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <CalendarArrowDown /> Newest <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('createdAt', 'asc')}
                                    className={`${sortBy === 'createdAt' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <CalendarArrowUp /> Newest <span>(ascending)</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {isLoading ? <TableSkeleten /> : auditLogs?.payload.metadata.total === 0 ?
                    <div>
                        <p className="text-center text-gray-500 col-span-full">No Exams found for this diploma</p>
                    </div>
                    : isLoading ? <TableSkeleten /> :
                        auditLogs?.payload.data.map((auditLog) => (

                            <div key={auditLog.id} className="pt-4">

                                <div>
                                    <p className={`text-sm font-bold ${auditLog.action === 'UPDATE' && 'text-yellow-600'} ${auditLog.action === 'CREATE' && 'text-emerald-600'} ${auditLog.action === 'DELETE' && 'text-red-600'} `}>{auditLog.action}</p>
                                    <p className='text-xs font-medium text-gray-400'>Method: {auditLog.httpMethod}</p>
                                </div>
                                <div>
                                    <p className='text-gray-800 text-sm font-medium'>{auditLog.actorUsername}</p>
                                    <p className='text-xs text-gray-400'>{auditLog.actorEmail}</p>
                                    <p className={`text-xs font-medium ${auditLog.actorRole === 'ADMIN' && 'text-blue-600'}`}>{auditLog.actorRole}</p>
                                </div>

                                <div>
                                    <p className='text-gray-800 capitalize'>{auditLog.entityType}</p>
                                    <Link href={`
                                    ${auditLog.entityType === 'question' ?
                                            `/dashboard/exams/exam-info?examId=${auditLog?.metadata?.examId}` :
                                            `/dashboard/${auditLog.entityType}s/${auditLog.metadata?.title}?${auditLog.entityType}Id=${auditLog.entityId}`
                                        }
                                        `} className='text-sm text-gray-400 flex items-center'>
                                        {auditLog.entityId} <ExternalLink size={14} />
                                    </Link>
                                </div>
                                <div>
                                    {(() => {
                                        const { time, date } = formatAuditCreatedAt(auditLog.createdAt as unknown as Date | string)
                                        return (
                                            <p className="text-sm">
                                                <span className="block">{time}</span>
                                                <span className="block">{date}</span>
                                            </p>
                                        )
                                    })()}
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/audit-log/${auditLog.entityType}%20${auditLog.action.toLowerCase()}%20by%20${auditLog.actorUsername}?auditlog=${auditLog.id}`}>
                                                    <Eye className="text-emerald-500" /> View
                                                </Link>
                                            </DropdownMenuItem>
                                            {role === 'SUPER ADMIN' &&
                                                <DropdownMenuItem onClick={() => deleteLog(auditLog.id)}>
                                                    <Trash2 className="text-destructive" /> Delete
                                                </DropdownMenuItem>}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                }
            </div>

        </>
    )
}
