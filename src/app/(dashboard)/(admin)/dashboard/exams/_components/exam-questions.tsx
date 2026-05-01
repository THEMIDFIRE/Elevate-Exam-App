'use client'

import { Button } from '@/shared/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { getQuestions } from '@/shared/lib/api/exams/questions.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, Ellipsis, Eye, PenLine, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { delQuestion } from '../api/question.api'
import { toast } from 'sonner'

export default function ExamQuestions({ examId, examTitle }: { examId: string | null, examTitle?: string }) {
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('asc')

    const router = useRouter()

    const { data, isLoading: questionsLoading, isError: questionsError } = useQuery({
        queryKey: ['questions', examId, sortBy, sortOrder],
        queryFn: () => getQuestions(examId as string, sortBy, sortOrder),
    })

    //Exam Questions
    const questionTitles = data?.payload.questions
    const { mutate: questionDelete } = useMutation({
        mutationFn: async (questionId: string) => {
            const res = await delQuestion(questionId)
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

    return (
        <div className="mt-6 *:grid *:grid-cols-[1fr_20%] *:p-2.5 *:items-center [&_span,&_button]:place-self-end">
            <div className="bg-blue-600 text-white">
                <p>Exam Questions</p>
                <Button variant={'link'} type='button'
                    onClick={() => router.push(`/dashboard/exams/create-new-question?examId=${examId}`)}
                    className="text-white flex items-center">
                    <Plus />Add Questions
                </Button>
            </div>
            <div>
                <p>Title</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                        Sort <ArrowDownWideNarrow />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="[&_div]:text-sm [&_span]:text-[10px] [&_span]:text-gray-500 [&_div]:hover:bg-gray-300/80">
                        <DropdownMenuItem onClick={() => (setSortBy('title'), setSortOrder('desc'))}
                            className={`${sortBy === 'title' && sortOrder === 'desc' && 'font-semibold'}`}
                        >
                            <ArrowDownAZ /> Title <span>(descending)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => (setSortBy('title'), setSortOrder('asc'))}
                            className={`${sortBy === 'title' && sortOrder === 'asc' && 'font-semibold'}`}
                        >
                            <ArrowUpAZ /> Title <span>(ascending)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => (setSortBy('createdAt'), setSortOrder('desc'))}
                            className={`${sortBy === 'createdAt' && sortOrder === 'desc' && 'font-semibold'}`}
                        >
                            <CalendarArrowDown /> Newest <span>(descending)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => (setSortBy('createdAt'), setSortOrder('asc'))}
                            className={`${sortBy === 'createdAt' && sortOrder === 'asc' && 'font-semibold'}`}
                        >
                            <CalendarArrowUp /> Newest <span>(ascending)</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {questionsError &&
                <div>
                    <p className="text-center col-span-2">
                        Error loading Questions
                    </p>
                </div>
            }
            {data?.payload.questions.length === 0 &&
                <div>
                    <p className="text-center col-span-2">No questions found</p>
                </div>}
            {questionsLoading ?
                Array.from({ length: 10 }, (_, i) => (
                    <div key={i}>
                        <Skeleton className="h-4 w-4/5 bg-gray-400 rounded-md" />
                    </div>
                ))
                :
                questionTitles?.map((questionTitle) => (
                    <div key={questionTitle.id}>
                        <p>{questionTitle.text}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Ellipsis />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/exams/${examTitle?.includes('/') ? examTitle?.replace('/', '%2F') : examTitle}/questions/${`${questionTitle.text.includes('/') ? questionTitle.text.replace('/', '%2F').replace('?', '%3F') : `${questionTitle.text.replace('?', '%3F')}`}`}?questionId=${questionTitle.id}
                                    `}>
                                        <Eye className="text-emerald-500" /> View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/exams/edit-question?examId=${questionTitle.examId}&questionId=${questionTitle.id}`}>
                                        <PenLine className="text-blue-600" />Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => questionDelete(questionTitle.id)}>
                                    <Trash2 className='text-red-500'/> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
        </div>

    )
}
