'use client'
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Ban, ExternalLink, PenLine, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { delExam, getExamInfo, setExamImmutability } from "../api/exams.api"
import ExamQuestions from "./exam-questions"

export default function AdminViewExamInfoComponent() {
    const params = useSearchParams()
    const examId = params.get('examId') as string

    const router = useRouter()

    const { data: exam, isLoading: examLoading, isError: examError } = useQuery({
        queryKey: ['exam', examId],
        queryFn: () => getExamInfo(examId as string),
    })

    const { mutate: examDelete } = useMutation({
        mutationFn: async (examId: string) => {
            const res = await delExam(examId)
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

    const { mutate: examImmutability } = useMutation({
        mutationFn: async (examId: string) => {
            const res = await setExamImmutability(examId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    // Exam Info
    const examTitle = exam?.payload.exam.title
    const examImg = exam?.payload?.exam?.image as string
    const examDescription = exam?.payload.exam.description
    const diplomaName = exam?.payload.exam.diploma.title
    const diplomaId = exam?.payload.exam.diplomaId
    const duration = exam?.payload.exam.duration
    const questionNum = exam?.payload.exam.questionsCount


    // Error Message
    if (examError) return <div>Error loading exam</div>


    return (
        <>
            <div className="flex items-center justify-between">
                <div className="grow">
                    {examLoading ?
                        <Skeleton className="h-3.5 w-3/4 bg-gray-500 rounded" />
                        : <h2 className={`text-lg font-semibold font-inter`}>{examTitle}</h2>}
                    <div className="text-gray-400 text-sm flex items-center">
                        Diploma: {examLoading ?
                            <Skeleton className="h-3 w-1/4 bg-gray-500 rounded" />
                            :
                            <Link href={`/dashboard/diplomas/${diplomaName}?diplomaId=${diplomaId}`} className="underline text-sm flex items-center gap-1">
                                {diplomaName} <ExternalLink size={14} />
                            </Link>
                        }
                    </div>
                </div>
                <div className="*:rounded-none space-x-2.5 *:space-x-2.5">
                    <Button variant={"secondary"} disabled={examLoading} onClick={() => examImmutability(examId)}>
                        <Ban />Immutable
                    </Button>
                    <Button variant={"ghost"} disabled={examLoading} className="bg-blue-600 text-white" onClick={() => router.push(`/dashboard/exams/${examTitle}/edit?examId=${examId}`)}>
                        <PenLine />Edit
                    </Button>
                    <Button variant={"destructive"} disabled={examLoading} onClick={() => examDelete(examId)}>
                        <Trash2 />Delete
                    </Button>
                </div>
            </div>
            <div className="mt-7 [&_h5]:text-sm [&_p]:text-sm [&_h5]:text-gray-400 *:space-y-1 space-y-4">
                <div>
                    <h5>Image</h5>
                    <div className="relative size-75">
                        {examLoading ?
                            <Skeleton className="size-full bg-gray-500 rounded-lg" />
                            :
                            <Image src={examImg} alt={`${examTitle}`} fill className="object-scale-down" />
                        }
                    </div>
                </div>
                <div>
                    <h5>Title</h5>
                    {examLoading ?
                        <Skeleton className="h-3.5 w-1/2 bg-gray-500 rounded" />
                        :
                        <p>{examTitle}</p>}
                </div>
                <div>
                    <h5>Description</h5>
                    {examLoading ?
                        <Skeleton className="h-3.5 w-1/2 bg-gray-500 rounded" />
                        :
                        <p>{examDescription}</p>}
                </div>
                <div>
                    <h5>Diploma</h5>
                    {examLoading ?
                        <Skeleton className="h-3.5 w-1/2 bg-gray-500 rounded" />
                        :
                        <p>{diplomaName}</p>}
                </div>
                <div>
                    <h5>Duration</h5>
                    {examLoading ?
                        <Skeleton className="size-5 bg-gray-500 rounded" />
                        :
                        <p>{duration}</p>}
                </div>
                <div>
                    <h5>No. of Questions</h5>
                    {examLoading ?
                        <Skeleton className="size-5 bg-gray-500 rounded" />
                        :
                        <p>{questionNum}</p>}
                </div>
            </div>
            <ExamQuestions examId={examId} examTitle={examTitle}/>
        </>
    )
}
