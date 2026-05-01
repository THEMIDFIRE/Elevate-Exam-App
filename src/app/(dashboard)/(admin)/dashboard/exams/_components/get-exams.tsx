'use client'
import { Button } from "@/shared/components/ui/button"
import { getExams } from "@/shared/lib/api/exams/exams.api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ExamDataTable from "./exam-data-table"
import ExamSearchFilters from "./exam-search-filter"
import { SortBy, SortOrder } from "@/shared/lib/types/sort"


export default function AdminExamsPage() {
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<SortBy>('createdAt')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [searchTitle, setSearchTitle] = useState('')
    const [diplomaId, setDiplomaId] = useState<string | null>(null)
    const [immutabilityFilter, setImmutabilityFilter] = useState<boolean | null>(null)

    const limit = 12

    const router = useRouter()


    const handleSortChange = (nextSortBy: SortBy, nextSortOrder: SortOrder) => {
        setSortBy(nextSortBy)
        setSortOrder(nextSortOrder)
        setPage(1)
    }

    const handleSearchChange = (search: string) => {
        setSearchTitle(search)
        setPage(1)
    }

    const handleDiplomaIdChange = (diplomaId: string | null) => {
        setDiplomaId(diplomaId)
        setPage(1)
    }

    const handleImmutability = (immutabilityFilter: boolean | null) => {
        setImmutabilityFilter(immutabilityFilter)
    }

    const { data: exams, isPlaceholderData, isLoading } = useQuery({
        queryKey: ['exams', page, sortBy, sortOrder, searchTitle, diplomaId, immutabilityFilter],
        queryFn: () => getExams(limit, page, diplomaId, sortBy, sortOrder, searchTitle, immutabilityFilter),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    })

    const totalPages = exams?.payload.metadata.totalPages
    const pageLimit = exams?.payload.metadata.limit ?? 0
    const totalDiplomas = exams?.payload.metadata.total ?? 0
    const rangeStart = totalDiplomas === 0 ? 0 : (page - 1) * pageLimit + 1
    const rangeEnd = Math.min(page * pageLimit, totalDiplomas)


    return (
        <>
            <div className="sticky top-0 z-20 bg-white flex items-center justify-between text-sm border-t border-gray-100 px-6 py-2">
                <div className="flex items-center">
                    <p>{rangeStart} - {rangeEnd} of {totalDiplomas}</p>
                    <Button variant={"ghost"} size={"icon"} onClick={() => setPage(page - 1)} disabled={page === 1}>
                        <ChevronLeft />
                    </Button>
                    <p className="text-gray-400">Page {page} of {totalPages ?? '—'}</p>
                    <Button variant={"ghost"} size={"icon"} onClick={() => { setPage(page + 1) }} disabled={isPlaceholderData || (totalPages != null && page >= totalPages)}>
                        <ChevronRight />
                    </Button>
                </div>
                <div>
                    <Button variant={"link"} onClick={() => router.push('/dashboard/exams/add-new-exam')}
                        className="text-white bg-emerald-500 px-4 rounded-none">
                        <Plus /> Add New Exam
                    </Button>
                </div>
            </div>
            <ExamSearchFilters setSearchTitle={handleSearchChange} setDiplomaId={handleDiplomaIdChange} setImmutabilityFilter={handleImmutability} />

            <ExamDataTable
                exams={exams}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                isLoading={isLoading}
            />
        </>
    )
}
