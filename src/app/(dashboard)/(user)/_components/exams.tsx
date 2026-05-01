'use client'
import GeneralHeader from "@/shared/components/header"
import { getExams } from "@/shared/lib/api/exams/exams.api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { BookOpenCheck, ChevronDown, CircleQuestionMark, MoveRight, Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useExamSession } from "@/shared/providers/exam-session-provider"

export default function Exams() {
    const params = useSearchParams()
    const { startExamSession } = useExamSession()

    const { diploma } = useParams()

    const diplomaName = decodeURIComponent(diploma as string)
    const diplomaId = params.get('diplomaId')

    const limit = 6

    const { inView, ref, entry } = useInView({ delay: 300, trackVisibility: true })
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['exams', diplomaId],
        queryFn: ({ pageParam }) => getExams(limit, pageParam, diplomaId),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.payload.metadata.page === lastPage.payload.metadata.totalPages) return undefined
            return lastPage.payload.metadata.page + 1
        }
    })

    const payload = data?.pages.flatMap(page => page.payload.data)


    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && entry) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, entry])


    return (
        <>
            <div className="px-6 p-1 h-full space-y-4">
                <GeneralHeader>
                    <BookOpenCheck size={40} />{diplomaName} Exams
                </GeneralHeader>
                <div className="space-y-4">
                    {payload?.map((exam) => (
                        <div key={exam.id} className="relative border border-dashed hover:border-gray-800 p-4 flex gap-4 group/exam">
                            <div className="size-25 aspect-square border border-blue-300 bg-blue-100 flex justify-center items-center">
                                <div className="size-18.75 aspect-square relative">
                                    <Image fill src={exam.image} alt={exam.title}
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex **:flex justify-between">
                                    <h4 className="text-xl font-semibold text-blue-600">{exam.title}</h4>
                                    <div className="*:text-sm w-1/2 flex justify-end h-fit divide-gray-500 divide-x">
                                        <div className="flex gap-1.5 px-1.5">
                                            <CircleQuestionMark size={18} />
                                            <p>{exam.questionsCount} questions</p>
                                        </div>
                                        <div className="flex gap-1.5 pl-1.5">
                                            <Timer size={18} />
                                            <p>{exam.duration} minutes</p>
                                        </div>
                                    </div>
                                </div>
                                <p>{exam.description}</p>
                            </div>
                            <Link
                                href={`/diplomas/${diplomaName}/${exam.title}?examId=${exam.id}`}
                                onClick={() => startExamSession(exam.id, Number(exam.duration))}
                                className="absolute right-2.5 bottom-2.5 hidden group-hover/exam:flex items-center gap-2.5 text-white bg-blue-600 h-fit py-1.5 px-4"
                            >
                                Start <MoveRight size={18} />
                            </Link>
                        </div>
                    ))}
                    {!isLoading &&
                        <div className="*:w-full *:text-gray-600 *:text-center col-span-3 my-8.5">
                            <p ref={ref}>{hasNextPage ? 'Scroll to view more' : 'End of list'}</p>
                            {hasNextPage && <ChevronDown />}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
