import AdminSectionHeader from '@/app/(dashboard)/(admin)/_components/shared/header'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { getExams } from '@/shared/lib/api/exams/exams.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getExamInfo } from '../../api/exams.api'
import z from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Check, CheckCheck, Plus, Trash2, X } from 'lucide-react'
import type { SingleQuestionData } from './create-new-question'

const addQuestionSchema = z.object({
    text: z.string().trim().min(1, 'Title is required').optional(),
    examId: z.string().trim().min(1, 'Exam is required').optional(),
    answers: z.array(
        z.object({
            text: z.string(),
            isCorrect: z.boolean(),
        })
    )
})

type AddQuestionFormValues = z.infer<typeof addQuestionSchema>

type NormalAddQuestionsProps = {
    singleQuestionData: SingleQuestionData
    setSingleQuestionData: React.Dispatch<React.SetStateAction<SingleQuestionData>>
}

const MAX_ANSWERS = 4

export default function NormalAddQuestionsComponent({
    singleQuestionData,
    setSingleQuestionData,
}: NormalAddQuestionsProps) {
    const [examInputDraft, setExamInputDraft] = useState('')
    const [isExamInputDirty, setIsExamInputDirty] = useState(false)
    const [showAddAnswer, setShowAddAnswer] = useState(false)
    const [answerDraft, setAnswerDraft] = useState('')
    const addAnswerInputRef = useRef<HTMLInputElement | null>(null)

    const params = useSearchParams()
    const examId = params.get('examId')

    const { register, setValue, formState: { errors } } = useForm<AddQuestionFormValues>({
        resolver: zodResolver(addQuestionSchema)
    })

    const limit = 20
    const { data: examsData } = useQuery({
        queryKey: ['examsFilter', examInputDraft],
        queryFn: () => getExams(limit, 1, null, undefined, undefined, examInputDraft.trim() || undefined)
    })
    const { data: selectedExamData } = useQuery({
        queryKey: ['selectedExam', examId],
        queryFn: () => getExamInfo(examId as string),
        enabled: Boolean(examId),
    })

    const examFilters = examsData?.payload?.data ?? []

    function handleSearchInputChange(value: string) {
        setIsExamInputDirty(true)
        setExamInputDraft(value)
        setValue('examId', '', { shouldValidate: true })
        setSingleQuestionData((prev) => ({ ...prev, examId: null }))
    }

    function handleSelectExam(id: string, title: string) {
        setIsExamInputDirty(true)
        setExamInputDraft(title)
        setValue('examId', id, { shouldValidate: true })
        setSingleQuestionData((prev) => ({ ...prev, examId: id }))
    }

    function handleAddAnswer() {
        if (!answerDraft.trim() || singleQuestionData.answers.length >= MAX_ANSWERS) return

        setSingleQuestionData((prev) => ({
            ...prev,
            answers: [
                ...prev.answers,
                { text: answerDraft.trim(), isCorrect: false },
            ],
        }))
        setAnswerDraft('')
        setShowAddAnswer(false)
    }

    function handleDeleteAnswer(answerIndex: number) {
        setSingleQuestionData((prev) => ({
            ...prev,
            answers: prev.answers.filter((_, idx) => idx !== answerIndex),
        }))
    }

    function handleMarkCorrect(answerIndex: number) {
        setSingleQuestionData((prev) => ({
            ...prev,
            answers: prev.answers.map((answer, idx) => ({
                ...answer,
                isCorrect: idx === answerIndex,
            })),
        }))
    }

    function handleAnswerTextChange(answerIndex: number, value: string) {
        setSingleQuestionData((prev) => ({
            ...prev,
            answers: prev.answers.map((answer, idx) =>
                idx === answerIndex ? { ...answer, text: value } : answer
            ),
        }))
    }

    useEffect(() => {
        if (showAddAnswer) {
            addAnswerInputRef.current?.focus()
        }
    }, [showAddAnswer])

    return (
        <>
            <AdminSectionHeader>
                Question Information
            </AdminSectionHeader>
            <form id='add-question'>
                <div className='space-y-4 [&_input]:rounded-none'>
                    <Field>
                        <FieldLabel htmlFor='examDiploma'>Exam</FieldLabel>
                        <Input type="hidden" {...register('examId')}
                            defaultValue={`${examId}`}
                        />
                        <Combobox>
                            <ComboboxInput className={'rounded-none'}
                                placeholder="Exam"
                                name="exam"
                                value={isExamInputDirty ? examInputDraft : (selectedExamData?.payload.exam.title || '')}
                                onChange={(e) => handleSearchInputChange(e.currentTarget.value)}
                            />
                            <ComboboxContent>
                                <ComboboxList>
                                    {examFilters.map((exam) => (
                                        <ComboboxItem
                                            key={exam.id}
                                            value={exam.title}
                                            onClick={() => handleSelectExam(exam.id, exam.title)}
                                        >
                                            {exam.title}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldError errors={[errors.examId]} />
                    </Field>
                    <Field>
                        <FieldLabel>Question Headline</FieldLabel>
                        <Input
                            type='text'
                            {...register('text')}
                            value={singleQuestionData.text}
                            onChange={(e) => {
                                const value = e.currentTarget.value
                                setSingleQuestionData((prev) => ({ ...prev, text: value }))
                            }}
                        />
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
                            disabled={singleQuestionData.answers.length >= MAX_ANSWERS}
                            className='rounded-none bg-emerald-500 text-white font-medium hover:border hover:border-emerald-500 hover:text-black'><Plus /> Add Answer</Button>
                    </div>
                    {singleQuestionData.answers.map((answer, answerIndex) => (
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
                                    disabled={!answerDraft.trim() || singleQuestionData.answers.length >= MAX_ANSWERS}
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
