'use client'
import React, { useState } from 'react'
import BulkAddQuestionsComponent from './bulk-add-questions'
import NormalAddQuestionsComponent from './normal-add-questions'
import { Button } from '@/shared/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { CopyPlus, Save, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { addBulkQuestions, addSingleQuestion } from '../../api/question.api'
import { toast } from 'sonner'
import type { IErrorResponse } from '@/shared/lib/types/api'

export type QuestionAnswer = {
    text: string
    isCorrect: boolean
}

export type SingleQuestionData = {
    text: string
    examId: string | null
    answers: QuestionAnswer[]
}

export type BulkQuestionData = {
    questions: {
        text: string
        answers: QuestionAnswer[]
    }[]
}

export default function CreateNewQuestionComponent() {
    const [bulk, setBulk] = useState(false)
    const params = useSearchParams()
    const examId = params.get('examId') as string
    const [singleQuestionData, setSingleQuestionData] = useState<SingleQuestionData>({
        text: '',
        examId,
        answers: []
    })
    const [bulkQuestionData, setBulkQuestionData] = useState<BulkQuestionData>({
        questions: [{
            text: '',
            answers: []
        }]
    })

    const router = useRouter()

    const { mutate: submitSingleQuestion, isPending: isSubmittingSingle } = useMutation({
        mutationFn: () => addSingleQuestion(singleQuestionData),
        onSuccess: () => {
            router.push('/dashboard/exams')
        }
    })

    const { mutate: submitBulkQuestions, isPending: isSubmittingBulk } = useMutation({
        // mutationFn: () => ,
        mutationFn: (payload: BulkQuestionData) => {
            const res = addBulkQuestions(examId, payload)
            return res
        },
        onSuccess: () => {
            router.push('/dashboard/exams')
        },
        onError: (error) => {
            const apiError = error as unknown as IErrorResponse
            toast.error(apiError.errors?.[0]?.message || apiError.message || 'Something went wrong')
        }
    })

    function handleSubmitBulkQuestions() {
        const sanitizedQuestions = bulkQuestionData.questions
            .map((question) => ({
                text: question.text.trim(),
                answers: question.answers
                    .map((answer) => ({
                        text: answer.text.trim(),
                        isCorrect: answer.isCorrect,
                    }))
                    .filter((answer) => answer.text.length > 0),
            }))
            .filter((question) => question.text.length > 0 || question.answers.length > 0)

        submitBulkQuestions({ questions: sanitizedQuestions })
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Button type='button' variant={'ghost'}
                    onClick={() => setBulk(prev => !prev)}
                    className={`rounded-none ${bulk && `bg-blue-500 text-white hover:border hover:border-blue-500`} duration-150`}
                ><CopyPlus /> Bulk Add Mode</Button>
                <div className='text-right *:rounded-none'>
                    <Button type='button' variant={'ghost'} onClick={() => router.back()}>
                        <X /> Cancel
                    </Button>
                    <Button
                        variant={'link'}
                        type='button'
                        onClick={bulk ? handleSubmitBulkQuestions : () => submitSingleQuestion()}
                        className='bg-emerald-500 text-white'
                        disabled={isSubmittingSingle || isSubmittingBulk}
                    >
                        <Save /> Save
                    </Button>
                </div>
            </div>
            {bulk ?
                <BulkAddQuestionsComponent
                    examId={examId}
                    bulkQuestionData={bulkQuestionData}
                    setBulkQuestionData={setBulkQuestionData}
                />
                :
                <NormalAddQuestionsComponent
                    singleQuestionData={singleQuestionData}
                    setSingleQuestionData={setSingleQuestionData}
                />
            }
        </>
    )
}
