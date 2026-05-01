'use client'
import AdminSectionHeader from '@/app/(dashboard)/(admin)/_components/shared/header'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { getExams } from '@/shared/lib/api/exams/exams.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, CheckCheck, Plus, Save, Trash2, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { getExamInfo } from '../../api/exams.api'
import { getQuestionInfo, updateQuestion } from '../../api/question.api'
import { toast } from 'sonner'

const addQuestionSchema = z.object({
    text: z.string().trim().optional(),
})

type AddQuestionFormValues = z.infer<typeof addQuestionSchema>

type ExamFilter = {
    id: string
    title: string
}

type EditableAnswer = {
    text: string
    isCorrect: boolean
}

const MAX_ANSWERS = 4

export default function EditQuestionsComponent() {
    const [showAddAnswer, setShowAddAnswer] = useState(false)
    const [answerDraft, setAnswerDraft] = useState('')
    const [answers, setAnswers] = useState<EditableAnswer[] | null>(null)
    const addAnswerInputRef = useRef<HTMLInputElement | null>(null)

    const params = useSearchParams()
    const examId = params.get('examId')
    const questionId = params.get('questionId')
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<AddQuestionFormValues>({
        resolver: zodResolver(addQuestionSchema)
    })

    const limit = 100

    const { data: examsData } = useQuery({
        queryKey: ['examsFilter'],
        queryFn: () => getExams(limit, 1, null, undefined, undefined)
    })

    const { data: selectedExamData } = useQuery({
        queryKey: ['selectedExam', examId],
        queryFn: () => getExamInfo(examId as string),
        enabled: Boolean(examId),
    })

    const { data: questionData, isFetching: fetchingQuestion } = useQuery({
        queryKey: ['questionData', questionId],
        queryFn: () => getQuestionInfo(questionId as string),
        enabled: Boolean(questionId),
    })

    const examFilters = useMemo<ExamFilter[]>(() => {
        const exams = examsData?.payload?.data ?? []
        return exams.map((exam) => ({ id: exam.id, title: exam.title }))
    }, [examsData])

    const initialAnswers = useMemo<EditableAnswer[]>(
        () => questionData?.payload.question.answers.map((answer) => ({
            text: answer.text,
            isCorrect: false,
        })) ?? [],
        [questionData]
    )
    const editableAnswers = answers ?? initialAnswers

    useEffect(() => {
        if (!questionId) {
            toast.error('Invalid question id')
            router.push('/dashboard/exams')
        }
    }, [questionId, router])

    useEffect(() => {
        if (showAddAnswer) addAnswerInputRef.current?.focus()
    }, [showAddAnswer])

    function handleAddAnswer() {
        if (!answerDraft.trim() || editableAnswers.length >= MAX_ANSWERS) return
        setAnswers((prev) => [...(prev ?? editableAnswers), { text: answerDraft.trim(), isCorrect: false }])
        setAnswerDraft('')
        setShowAddAnswer(false)
    }

    function handleDeleteAnswer(answerIndex: number) {
        setAnswers((prev) => (prev ?? editableAnswers).filter((_, idx) => idx !== answerIndex))
    }

    function handleMarkCorrect(answerIndex: number) {
        setAnswers((prev) =>
            (prev ?? editableAnswers).map((answer, idx) => ({
                ...answer,
                isCorrect: idx === answerIndex,
            }))
        )
    }

    function handleAnswerTextChange(answerIndex: number, value: string) {
        setAnswers((prev) =>
            (prev ?? editableAnswers).map((answer, idx) =>
                idx === answerIndex ? { ...answer, text: value } : answer
            )
        )
    }

    const { mutate: formSubmit, isPending: editingExam } = useMutation({
        mutationFn: async (data: AddQuestionFormValues) => {
            if (!questionId) throw new Error('Invalid question id')

            const normalizedAnswers = editableAnswers
                .map((answer) => ({ ...answer, text: answer.text.trim() }))
                .filter((answer) => answer.text.length > 0)

            if (normalizedAnswers.length === 0) {
                throw new Error('At least one answer is required')
            }

            const correctAnswersCount = normalizedAnswers.filter((answer) => answer.isCorrect).length
            if (correctAnswersCount !== 1) {
                throw new Error('Exactly one answer must be marked as correct')
            }

            const updatedQuestionPayload = {
                text: data.text?.trim() || questionData?.payload.question.text || '',
                answers: normalizedAnswers,
            }

            const res = await updateQuestion(updatedQuestionPayload, questionId)
            return res
        },
        onSuccess: () => {
            toast.success('Question successfully updated')
            router.push(`/dashboard/exams/${examId}?examId=${examId}`)
        },
        onError: (res) => {
            toast.error(res.message || 'Something went wrong')
        }
    })

    const onSubmit = (data: AddQuestionFormValues) => formSubmit(data)

    return (
        <>
            <div className='text-right *:rounded-none'>
                <Button type='button' variant={'ghost'} onClick={() => router.back()}>
                    <X /> Cancel
                </Button>
                <Button
                    form='edit-question'
                    variant={'link'}
                    type='submit'
                    className='bg-emerald-500 text-white'
                    disabled={editingExam || fetchingQuestion}
                >
                    <Save /> Save
                </Button>
            </div>
            <AdminSectionHeader>
                Question Information
            </AdminSectionHeader>
            <form id='edit-question' onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-4 [&_input]:rounded-none'>
                    <Field>
                        <FieldLabel htmlFor='examDiploma'>Exam</FieldLabel>
                        <Input type="hidden" disabled
                            defaultValue={`${examId}`}
                        />
                        <Combobox>
                            <ComboboxInput className={'rounded-none'}
                                placeholder="Exam"
                                name="exam"
                                value={selectedExamData?.payload.exam.title || ''}
                            />
                            <ComboboxContent>
                                <ComboboxList>
                                    {examFilters.map(({ id, title }) => (
                                        <ComboboxItem key={id} value={title}>
                                            {title}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    <Field>
                        <FieldLabel>Question Headline</FieldLabel>
                        <Input
                            type='text'
                            placeholder={questionData?.payload.question.text || 'Question headline'}
                            {...register('text')}
                        />
                        <FieldError errors={[errors.text]} />
                    </Field>

                </div>
                <AdminSectionHeader className='mb-0'>
                    Question Answers
                </AdminSectionHeader>
                <div className='*:grid *:grid-cols-[5%_1fr_15%] *:place-items-center [&_p]:place-self-start'>
                    <div className='*:py-2.5 *:px-4'>
                        <p className='sol-start-2 col-end-3 font-medium'>Body</p>
                        <Button variant={'secondary'} type='button'
                            onClick={() => setShowAddAnswer(prev => !prev)}
                            disabled={editableAnswers.length >= MAX_ANSWERS}
                            className='rounded-none bg-emerald-500 text-white font-medium hover:border hover:border-emerald-500 hover:text-black'><Plus /> Add Answer</Button>
                    </div>
                    {editableAnswers.map((answer, answerIndex) => (
                        <div key={`${answer.text}-${answerIndex}`}>
                            <Button variant={'ghost'} type='button' size={'icon'} onClick={() => handleDeleteAnswer(answerIndex)}>
                                <Trash2 size={18} className='text-red-500' />
                            </Button>
                            <Input
                                type='text'
                                value={answer.text}
                                onChange={(e) => handleAnswerTextChange(answerIndex, e.currentTarget.value)}
                                className='py-2.5 px-4 border-0 shadow-none'
                            />
                            <Button variant={'ghost'} type='button' onClick={() => handleMarkCorrect(answerIndex)}
                                className='*:flex *:items-center *:gap-x-1.5'
                            >
                                {answer.isCorrect ?
                                    <span className='text-emerald-500'>
                                        <CheckCheck /> Correct Answer
                                    </span>
                                    :
                                    <span>
                                        <Check /> Mark Correct
                                    </span>
                                }
                            </Button>
                        </div>
                    ))}
                    {showAddAnswer &&
                        <div className='bg-emerald-50'>
                            <Button variant={'ghost'} type='button' size={'icon'}
                                onClick={() => setShowAddAnswer(prev => !prev)}
                                className="bg-transparent size-7.5 text-center border border-gray-200 rounded-full">
                                <X size={20} />
                            </Button>
                            <Input
                                type='text'
                                placeholder='Enter answer body'
                                className='border border-emerald-500 bg-white rounded-none'
                                value={answerDraft}
                                onChange={(e) => setAnswerDraft(e.currentTarget.value)}
                                ref={addAnswerInputRef}
                            />
                            <div className='p-2.5 place-self-stretch'>
                                <Button
                                    variant={'ghost'}
                                    type='button'
                                    onClick={handleAddAnswer}
                                    disabled={!answerDraft.trim() || editableAnswers.length >= MAX_ANSWERS}
                                    className='bg-emerald-500 text-white rounded-none w-full'
                                >
                                    <Plus size={18} /> Add
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            </form >
        </>
    )
}
