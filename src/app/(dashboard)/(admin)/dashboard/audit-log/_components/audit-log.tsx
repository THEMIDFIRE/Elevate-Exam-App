'use client'

import { Button } from '@/shared/components/ui/button'
import { SortBy, SortOrder } from '@/shared/lib/types/sort'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Shredder } from 'lucide-react'
import { useState } from 'react'
import { getAuditLogs } from '../api/audit-log.api'
import AuditLogDataTable from './audit-log-table'
import AuditLogFilter from './audit-log-filter'
import { Dialog, DialogTrigger } from '@/shared/components/ui/dialog'
import ConfirmClearAll from './confirmation-dialog'

export default function AdminAuditlogComponent({ role }: { role: string }) {
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<SortBy>('createdAt')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [category, setCategory] = useState('')
    const [action, setAction] = useState('')
    const [actorUserId, setActorUserId] = useState('')

    const handleSortChange = (nextSortBy: SortBy, nextSortOrder: SortOrder) => {
        setSortBy(nextSortBy)
        setSortOrder(nextSortOrder)
        setPage(1)
    }

    const { data: auditLogs, isPlaceholderData, isLoading } = useQuery({
        queryKey: ['audit-logs', page, category, action, actorUserId, sortBy, sortOrder],
        queryFn: () => getAuditLogs(20, page, category, action, actorUserId, sortBy, sortOrder),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    })

    const totalPages = auditLogs?.payload.metadata.totalPages
    const pageLimit = auditLogs?.payload.metadata.limit ?? 0
    const totalLogs = auditLogs?.payload.metadata.total ?? 0
    const rangeStart = totalLogs === 0 ? 0 : (page - 1) * pageLimit + 1
    const rangeEnd = Math.min(page * pageLimit, totalLogs)

    function handleCategoryFilter(value: string) {
        setCategory(value)
        setPage(1)
    }
    function handleActionFilter(value: string) {
        setAction(value)
        setPage(1)
    }

    function handleActorUserId(value: string) {
        setActorUserId(value)
        setPage(1)
    }

    return (
        <>
            <div className="sticky top-0 z-20 bg-white flex items-center justify-between text-sm border-t border-gray-100 px-6 py-2">
                <div className="flex items-center">
                    <p>{rangeStart} - {rangeEnd} of {totalLogs}</p>
                    <Button variant={"ghost"} size={"icon"} onClick={() => setPage(page - 1)} disabled={page === 1}>
                        <ChevronLeft />
                    </Button>
                    <p className="text-gray-400">Page {page} of {totalPages ?? '—'}</p>
                    <Button variant={"ghost"} size={"icon"} onClick={() => { setPage(page + 1) }} disabled={isPlaceholderData || (totalPages != null && page >= totalPages)}>
                        <ChevronRight />
                    </Button>
                </div>

                {role === 'SUPER ADMIN' && <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"destructive"}
                                className="px-4 rounded-none">
                                <Shredder /> Clear All Logs
                            </Button>
                        </DialogTrigger>
                        <ConfirmClearAll />
                    </Dialog>
                </div>
                }
            </div>

            <AuditLogFilter setCategory={handleCategoryFilter} setAction={handleActionFilter} setActorUserId={handleActorUserId} />

            <AuditLogDataTable
                auditLogs={auditLogs}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                isLoading={isLoading}
                role={role} />
        </>
    )
}
