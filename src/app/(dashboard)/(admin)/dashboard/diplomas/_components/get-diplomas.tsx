'use client'
import { Button } from "@/shared/components/ui/button"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import DiplomaSearchFilters from "./diplomas-search-filter"
import DiplomasDataTable from "./diploma-data-table"
import { useRouter } from "next/navigation"
import { getDiplomas } from "@/shared/lib/api/diplomas/allDiplomas.api"
import { SortBy, SortOrder } from "@/shared/lib/types/sort"


export default function AdminDiplomasPage() {
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<SortBy>('createdAt')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [searchTitle, setSearchTitle] = useState('')
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

    const handleImmutability = (immutabilityFilter: boolean | null) => {
        setImmutabilityFilter(immutabilityFilter)
    }

    const { data: diplomas, isPlaceholderData, isLoading } = useQuery({
        queryKey: ['diplomas', page, sortBy, sortOrder, searchTitle, immutabilityFilter],
        queryFn: () => getDiplomas(limit, page, sortBy, sortOrder, searchTitle, immutabilityFilter),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    })

    const totalPages = diplomas?.payload.metadata.totalPages
    const pageLimit = diplomas?.payload.metadata.limit ?? 0
    const totalDiplomas = diplomas?.payload.metadata.total ?? 0
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
                    <Button variant={"link"} onClick={() => router.push('/dashboard/diplomas/add-new-diploma')}
                        className="text-white bg-emerald-500 px-4 rounded-none">
                        <Plus /> Add New Diploma
                    </Button>
                </div>
            </div>
            <DiplomaSearchFilters setSearchTitle={handleSearchChange} setImmutabilityFilter={handleImmutability} />

            <DiplomasDataTable
                diplomas={diplomas}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                isLoading={isLoading}
            />
        </>
    )
}
