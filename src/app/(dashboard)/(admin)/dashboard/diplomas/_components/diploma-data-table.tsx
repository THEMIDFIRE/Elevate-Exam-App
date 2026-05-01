import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Diplomas } from '@/shared/lib/types/diplomas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, EllipsisVertical, Eye, PenLine, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { delDiploma } from '../api/diplomas.api'
import TableSkeleten from './table-skeleton'
import { SortBy, SortOrder } from '@/shared/lib/types/sort'

type DiplomasDataTableProps = {
    diplomas?: Diplomas
    sortBy: SortBy
    sortOrder: SortOrder
    onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void
    isLoading: boolean
}

export default function DiplomasDataTable({ diplomas, sortBy, sortOrder, onSortChange, isLoading }: DiplomasDataTableProps) {
    const queryClient = useQueryClient()

    const { mutate: diplomaDelete } = useMutation({
        mutationFn: async (diplomaId: string) => {
            const res = await delDiploma(diplomaId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
            queryClient.invalidateQueries({ queryKey: ['diplomas'] })
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    return (
        <>
            <div className="*:grid *:grid-cols-[15%_20%_1fr_10%] *:items-center *:gap-2 mt-4 *:p-2 p-2">
                <div className="bg-blue-600 text-white">
                    <div className="diplomaImg">Image</div>
                    <div>Title</div>
                    <div className="diplomaDescription">Description</div>
                    <div className="actions w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                Sort <ArrowDownWideNarrow />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="[&_div]:text-sm [&_span]:text-[10px] [&_span]:text-gray-500 [&_div]:hover:bg-gray-300/80">
                                <DropdownMenuItem onClick={() => onSortChange('title', 'desc')}
                                    className={`${sortBy === 'title' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <ArrowDownAZ /> Title <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('title', 'asc')}
                                    className={`${sortBy === 'title' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <ArrowUpAZ /> Title <span>(ascending)</span>
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
                {isLoading ? <TableSkeleten /> : diplomas?.payload.metadata.total === 0 ?
                    <div>
                        <p className="text-center text-gray-500 col-span-full">No diplomas found matching your search</p>
                    </div>
                    : isLoading ? <TableSkeleten /> :
                        diplomas?.payload.data.map((diploma) => (
                            <div key={diploma.id} className="pt-4">
                                <div>
                                    <div className="relative size-20">
                                        {diploma.image && <Image fill src={diploma.image} alt={diploma.title} />}
                                    </div>
                                </div>
                                <div>
                                    <Tooltip>
                                        <TooltipTrigger className="truncate" asChild>
                                            <p>{diploma.title}</p>
                                        </TooltipTrigger>
                                        <TooltipContent>{diploma.title}</TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className='overflow-hidden'>
                                    <p className='truncate'>{diploma.description}</p>
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link href={`diplomas/${diploma.title.includes('/') ? diploma.title.replace('/', '%2F') : diploma.title}?diplomaId=${diploma.id}`}>
                                                    <Eye className="text-emerald-500" /> View
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`diplomas/edit-diploma?diplomaId=${diploma.id}`}>
                                                    <PenLine className="text-blue-600" />Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => diplomaDelete(diploma.id)}>
                                                <Trash2 className="text-destructive" /> Delete
                                            </DropdownMenuItem>
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
