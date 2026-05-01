'use client'
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Ban, ExternalLink, PenLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { delQuestion, getQuestionInfo, setQuestionImmutability } from "../../../../api/question.api"

export default function QuestionInfoComponent() {
    const params = useSearchParams()
    const questionId = params.get('questionId') as string

    const router = useRouter()

    const { data: questiondetails, isLoading, isError } = useQuery({
        queryKey: ['questionDetails'],
        queryFn: () => getQuestionInfo(questionId as string)
    })

    const { mutate: questionImmutability } = useMutation({
        mutationFn: async (questionId: string) => {
            const res = await setQuestionImmutability(questionId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

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

    const examName = questiondetails?.payload.question.exam.title
    const examId = questiondetails?.payload.question.examId

    const questionTitle = questiondetails?.payload.question.text

    if (isError) {
        return <div className="h-[80dvh] flex items-center justify-center">Question not found</div>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="grow">
                    {isLoading ?
                        <Skeleton className="h-3.5 w-3/4 bg-gray-500 rounded" />
                        : <h2 className={`text-lg font-semibold font-inter`}>{questionTitle}</h2>}
                    <div className="text-gray-400 text-sm flex items-center">
                        Exam: {isLoading ?
                            <Skeleton className="h-3 w-1/4 bg-gray-500 rounded" />
                            :
                            <Link href={`/dashboard/exams/${examName}?examId=${examId}`} className="underline text-sm flex items-center gap-1">
                                {examName} <ExternalLink size={14} />
                            </Link>
                        }
                    </div>
                </div>
                <div className="*:rounded-none space-x-2.5 *:space-x-2.5">
                    <Button variant={"secondary"} disabled={isLoading}
                    onClick={() => questionImmutability(questionId)}
                    >
                        <Ban />Immutable
                    </Button>
                    <Button variant={"ghost"} disabled={isLoading} className="bg-blue-600 text-white"
                        onClick={() => router.push(`/dashboard/exams/${examName}/edit?examId=${examId}`)}
                    >
                        <PenLine />Edit
                    </Button>
                    <Button variant={"destructive"} disabled={isLoading}
                    onClick={() => questionDelete(questionId)}
                    >
                        <Trash2 />Delete
                    </Button>
                </div>
            </div>
            <div className="space-y-4 mt-8 text-sm [&_span]:text-gray-400">
                <div>
                    <span>Headline</span>
                    <p>{questionTitle}</p>
                </div>
                <div>
                    <span>Exam</span>
                    <Link href={`/dashboard/exams/${examName}?examId=${examId}`} className="flex items-center gap-1">
                        {examName} <ExternalLink size={14} />
                    </Link>
                </div>
                <div>
                    <span>Answers</span>
                    <p>{questiondetails?.payload.question.answers.length}</p>
                </div>
            </div>
        </>
    )
}
