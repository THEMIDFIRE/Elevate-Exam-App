import AdminSectionHeader from '@/app/(dashboard)/(admin)/_components/shared/header'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { getExams } from '@/shared/lib/api/exams/exams.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Check, CheckCheck, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { getExamInfo } from '../../api/exams.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import type { BulkQuestionData } from './create-new-question'

const addQuestionSchema = z.object({
    questions: z.array(
        z.object({
            text: z.string().trim().min(1, 'Title is required').optional(),
            answers: z.array(
                z.object({
                    text: z.string(),
                    isCorrect: z.boolean(),
                })
            )
        })
    )
})

type AddQuestionFormValues = z.infer<typeof addQuestionSchema>

type BulkAddQuestionsProps = {
    examId: string
    bulkQuestionData: BulkQuestionData
    setBulkQuestionData: React.Dispatch<React.SetStateAction<BulkQuestionData>>
}

const MAX_ANSWERS = 4

export default function BulkAddQuestionsComponent({
    examId,
    bulkQuestionData,
    setBulkQuestionData,
}: BulkAddQuestionsProps) {
    const [examInputDraft, setExamInputDraft] = useState('')
    const [isExamInputDirty, setIsExamInputDirty] = useState(false)
    const [showAddAnswer, setShowAddAnswer] = useState(false)
    const [answerDraft, setAnswerDraft] = useState('')
    const addAnswerInputRef = useRef<HTMLInputElement | null>(null)
    const [questionTabs, setQuestionTabs] = useState(['q1'])
    const [activeTab, setActiveTab] = useState('q1')

    const { register, formState: { errors } } = useForm<AddQuestionFormValues>({
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
    }

    function handleSelectExam(title: string) {
        setIsExamInputDirty(true)
        setExamInputDraft(title)
    }

    const activeQuestionIndex = Math.max(Number(activeTab.replace('q', '')) - 1, 0)
    const activeQuestion = bulkQuestionData.questions[activeQuestionIndex]

    function updateActiveQuestion(
        updater: (question: BulkQuestionData['questions'][number]) => BulkQuestionData['questions'][number]
    ) {
        setBulkQuestionData((prev) => ({
            ...prev,
            questions: prev.questions.map((question, idx) =>
                idx === activeQuestionIndex ? updater(question) : question
            ),
        }))
    }

    function updateQuestionByIndex(
        questionIndex: number,
        updater: (question: BulkQuestionData['questions'][number]) => BulkQuestionData['questions'][number]
    ) {
        setBulkQuestionData((prev) => ({
            ...prev,
            questions: prev.questions.map((question, idx) =>
                idx === questionIndex ? updater(question) : question
            ),
        }))
    }

    function handleAddTab() {
        const nextTab = `q${questionTabs.length + 1}`
        setQuestionTabs((prev) => [...prev, nextTab])
        setBulkQuestionData((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    text: '',
                    answers: [],
                },
            ],
        }))
        setShowAddAnswer(false)
        setAnswerDraft('')
        setActiveTab(nextTab)
    }

    function handleRemoveTab(tab: string, tabIndex: number) {
        if (questionTabs.length <= 1) return
        const remainingTabs = questionTabs.filter((value) => value !== tab)
        setQuestionTabs(remainingTabs)
        setBulkQuestionData((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, index) => index !== tabIndex),
        }))
        if (activeTab === tab) setActiveTab(remainingTabs[Math.max(tabIndex - 1, 0)])
    }

    function handleAddAnswer() {
        if (!answerDraft.trim() || !activeQuestion || activeQuestion.answers.length >= MAX_ANSWERS) return
        updateActiveQuestion((question) => ({
            ...question,
            answers: [...question.answers, { text: answerDraft.trim(), isCorrect: false }],
        }))
        setAnswerDraft('')
        setShowAddAnswer(false)
    }

    function handleDeleteAnswer(answerIndex: number) {
        updateActiveQuestion((question) => ({
            ...question,
            answers: question.answers.filter((_, idx) => idx !== answerIndex),
        }))
    }

    function handleMarkCorrect(answerIndex: number) {
        updateActiveQuestion((question) => ({
            ...question,
            answers: question.answers.map((answer, idx) => ({
                ...answer,
                isCorrect: idx === answerIndex,
            })),
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
                        <Input type="hidden" disabled
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
                                        <ComboboxItem key={exam.id} value={exam.title} onClick={() => handleSelectExam(exam.title)}>
                                            {exam.title}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>

                </div>
                <AdminSectionHeader className='mb-0'>
                    Questions
                </AdminSectionHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className='gap-0'>
                    <TabsList className='bg-transparent rounded-none p-0'>
                        {questionTabs.map((tab, idx) => (
                            <TabsTrigger key={tab} value={tab} className='w-30 group/tabs-trigger group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none group-data-[variant=default]/tabs-list:data-[state=active]:border group-data-[variant=default]/tabs-list:data-[state=active]:border-blue-600 rounded-none'>
                                <span>{`Q${idx + 1}`}</span>
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleRemoveTab(tab, idx)
                                    }}
                                    className='ml-2 opacity-0 group-hover/tabs-trigger:opacity-100 transition-opacity'
                                >
                                    <X size={12} />
                                </button>
                            </TabsTrigger>
                        ))}
                        <Button
                            variant={'ghost'}
                            type='button'
                            size={'icon'}
                            onClick={handleAddTab}
                        >
                            <Plus />
                        </Button>
                    </TabsList>
                    {questionTabs.map((tab, tabIndex) => {
                        const question = bulkQuestionData.questions[tabIndex]
                        return (
                            <TabsContent key={tab} value={tab} className='border border-blue-600 p-4'>
                                <Field>
                                    <FieldLabel>Question Headline</FieldLabel>
                                    <Input
                                        type='text'
                                        {...register(`questions.${tabIndex}.text`)}
                                        value={question?.text || ''}
                                        onChange={(e) => {
                                            const value = e.currentTarget.value
                                            updateQuestionByIndex(tabIndex, (currentQuestion) => ({ ...currentQuestion, text: value }))
                                        }}
                                    />
                                    <FieldError errors={[errors.questions]} />
                                </Field>
                                <div className='*:grid *:grid-cols-[5%_1fr_15%] *:place-items-center [&_p]:place-self-start'>
                                    <div className='*:py-2.5 *:px-4'>
                                        <p className='sol-start-2 col-end-3 font-medium'>Body</p>
                                        <Button variant={'secondary'} type='button'
                                            onClick={() => setShowAddAnswer(prev => !prev)}
                                            disabled={Boolean(activeQuestion && activeQuestion.answers.length >= MAX_ANSWERS)}
                                            className='rounded-none bg-emerald-500 text-white font-medium hover:border hover:border-emerald-500 hover:text-black'><Plus /> Add Answer</Button>
                                    </div>
                                    {question?.answers.map((answer, answerIndex) => (
                                        <div key={`${answer.text}-${answerIndex}`}>
                                            <Button variant={'ghost'} type='button' size={'icon'} onClick={() => {
                                                if (tabIndex !== activeQuestionIndex) return
                                                handleDeleteAnswer(answerIndex)
                                            }}>
                                                <Trash2 size={18} className='text-red-500' />
                                            </Button>
                                            <Input
                                                type='text'
                                                value={answer.text}
                                                onChange={(e) => {
                                                    const value = e.currentTarget.value
                                                    updateQuestionByIndex(tabIndex, (currentQuestion) => ({
                                                        ...currentQuestion,
                                                        answers: currentQuestion.answers.map((currentAnswer, idx) =>
                                                            idx === answerIndex ? { ...currentAnswer, text: value } : currentAnswer
                                                        ),
                                                    }))
                                                }}
                                                className='py-2.5 px-4 border-0 shadow-none'
                                            />
                                            <Button variant={'ghost'} type='button' onClick={() => {
                                                if (tabIndex !== activeQuestionIndex) return
                                                handleMarkCorrect(answerIndex)
                                            }}
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
                                                    disabled={!answerDraft.trim() || Boolean(activeQuestion && activeQuestion.answers.length >= MAX_ANSWERS)}
                                                    className='bg-emerald-500 text-white rounded-none w-full'
                                                >
                                                    <Plus size={18} /> Add
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </form >
        </>
    )
}
