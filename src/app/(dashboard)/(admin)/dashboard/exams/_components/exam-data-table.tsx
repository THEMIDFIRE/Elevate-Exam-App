import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Exams } from '@/shared/lib/types/exams'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDown01, ArrowDownAZ, ArrowDownWideNarrow, ArrowUp10, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, EllipsisVertical, Eye, PenLine, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { delExam } from '../api/exams.api'
import TableSkeleten from './table-skeleton'
import { SortBy, SortOrder } from '@/shared/lib/types/sort'

type ExamsDataTableProps = {
    exams?: Exams
    sortBy: SortBy
    sortOrder: SortOrder
    onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void
    isLoading: boolean
}

export default function ExamDataTable({ exams, sortBy, sortOrder, onSortChange, isLoading }: ExamsDataTableProps) {
    const queryClient = useQueryClient()

    const { mutate: examDelete } = useMutation({
        mutationFn: async (examId: string) => {
            const res = await delExam(examId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
            queryClient.invalidateQueries({ queryKey: ['exams'] })
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    return (
        <>
            <div className="*:grid *:grid-cols-[10%_1fr_20%_20%_10%] *:items-center *:gap-2.5 mt-4 *:p-2 p-2">
                <div className="bg-blue-600 text-white">
                    <div className="diplomaImg">Image</div>
                    <div>Title</div>
                    <div className="diplomaDescription">Diploma</div>
                    <div className="diplomaDescription">No. of Questions</div>
                    <div className="w-full">
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
                                <DropdownMenuItem onClick={() => onSortChange('questions', 'desc')}
                                    className={`${sortBy === 'questions' && sortOrder === 'desc' && 'font-semibold'}`}
                                >
                                    <ArrowDown01 /> Questions No. <span>(descending)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onSortChange('questions', 'asc')}
                                    className={`${sortBy === 'questions' && sortOrder === 'asc' && 'font-semibold'}`}
                                >
                                    <ArrowUp10 /> Questions No. <span>(ascending)</span>
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
                {isLoading ? <TableSkeleten /> : exams?.payload.metadata.total === 0 ?
                    <div>
                        <p className="text-center text-gray-500 col-span-full">No Exams found for this diploma</p>
                    </div>
                    : isLoading ? <TableSkeleten /> :
                        exams?.payload.data.map((exam) => (
                            <div key={exam.id} className="pt-4">
                                <div>
                                    <div className="relative size-20">
                                        {exam.image && <Image fill src={exam.image} alt={exam.title} className='object-cover object-center' />}
                                    </div>
                                </div>
                                <div>
                                    <p>{exam.title}</p>
                                </div>
                                <div>
                                    <Tooltip>
                                        <TooltipTrigger className="truncate" asChild>
                                            <p>{exam.diploma.title}</p>
                                        </TooltipTrigger>
                                        <TooltipContent>{exam.diploma.title}</TooltipContent>
                                    </Tooltip>
                                </div>

                                <div>
                                    <p>{exam.questionsCount}</p>
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/exams/${exam.title.includes('/') ? exam.title.replace('/', '%2F') : exam.title}?examId=${exam.id}`}>
                                                    <Eye className="text-emerald-500" /> View
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/exams/${exam.title}/edit?examId=${exam.id}`}>
                                                    <PenLine className="text-blue-600" />Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => examDelete(exam.id)}>
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
