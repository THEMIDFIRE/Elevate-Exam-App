'use client'

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Progress } from "@/shared/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { getQuestions } from "@/shared/lib/api/exams/questions.api";
import { ExamAnswersType, submitSubmission } from "@/shared/lib/api/exams/submissions.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, CircleQuestionMark } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ResultsComponent from "./results";
import GeneralHeader from "@/shared/components/header";
import { useExamSession } from "@/shared/providers/exam-session-provider";

const circularProgressStyles = buildStyles({
    strokeLinecap: 'butt',
    pathColor: 'rgba(21, 93, 252, 1)',
    trailColor: 'rgba(219, 234, 254, 1)',
    textColor: '#000'
});


type ExamSessionState = {
    answers: ExamAnswersType["answers"];
    startedAt: string;
}

export default function ExamQuestions() {
    const params = useSearchParams()
    const { exam } = useParams()
    const { getExamSession } = useExamSession()

    const examTitle = decodeURIComponent(exam as string)
    const examId = params.get('examId')

    const sessionDurationMinutes = useMemo(() => {
        if (!examId) return undefined
        return getExamSession(examId)?.durationMinutes
    }, [examId, getExamSession])

    const timerMinutes = Number.isFinite(sessionDurationMinutes) && sessionDurationMinutes! > 0 ? sessionDurationMinutes! : 60
    const totalTimerSeconds = Math.floor(timerMinutes * 60)

    const { diploma } = useParams()
    const diplomaName = decodeURIComponent(diploma as string)

    const { data, isLoading } = useQuery({
        queryKey: ['examQuestions', examId],
        queryFn: async () => {
            if (!examId) {
                throw new Error('Exam ID is required')
            }
            const res = await getQuestions(examId)
            return res
        },
        enabled: !!examId
    })

    const { mutate, isPending, isSuccess, data: submissionResult } = useMutation({
        mutationFn: submitSubmission,
    })

    const questions = useMemo(() => data?.payload.questions ?? [], [data?.payload.questions])
    const totalQuestions = questions.length

    const [questionNumber, setQuestionNumber] = useState(0)
    const currentQuestion = questions?.[questionNumber]

    const [examSessions, setExamSessions] = useState<Record<string, ExamSessionState>>({})
    const [remainingSeconds, setRemainingSeconds] = useState(totalTimerSeconds)
    const timeoutSubmittedRef = useRef(false)
    const currentSession = examId ? examSessions[examId] : undefined
    const examAnswers: ExamAnswersType | undefined = useMemo(() => (
        examId && currentSession
            ? {
                examId,
                answers: currentSession.answers,
                startedAt: currentSession.startedAt
            }
            : undefined
    ), [currentSession, examId])

    const currentQuestionId = currentQuestion?.id
    const currentAnswer = useMemo(() => (
        examAnswers?.answers.find(answer => answer.questionId === currentQuestionId)
    ), [examAnswers, currentQuestionId])

    const answeredQuestionIds = useMemo(() => (
        new Set((examAnswers?.answers ?? []).filter(a => a.answerId).map(a => a.questionId))
    ), [examAnswers])

    const hasAllAnswers = useMemo(() => (
        totalQuestions > 0 && questions.every(q => answeredQuestionIds.has(q.id))
    ), [answeredQuestionIds, questions, totalQuestions])

    const handleAnswerChange = useCallback((answerId: string) => {
        if (!currentQuestion?.id || !examId) return

        setExamSessions(prev => {
            const current = prev[examId] ?? {
                answers: [],
                startedAt: new Date().toISOString()
            }
            const existingAnswerIndex = current.answers.findIndex(
                answer => answer.questionId === currentQuestion.id
            )

            const newAnswers = [...current.answers]

            if (existingAnswerIndex !== -1) {
                newAnswers[existingAnswerIndex] = {
                    questionId: currentQuestion.id,
                    answerId: answerId
                }
            } else {
                newAnswers.push({
                    questionId: currentQuestion.id,
                    answerId: answerId
                })
            }

            return { ...prev, [examId]: { ...current, answers: newAnswers } }
        })
    }, [currentQuestion, examId])


    const examProgress = totalQuestions > 0 ? ((questionNumber + 1) * 100) / totalQuestions : 0
    const timerProgress = totalTimerSeconds > 0 ? remainingSeconds : 0
    const timerText = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`

    const nextQuestion = useCallback(() => {
        setQuestionNumber(prev => (prev < totalQuestions - 1 ? prev + 1 : prev))
    }, [totalQuestions])

    const prevQuestion = useCallback(() => {
        setQuestionNumber(prev => (prev > 0 ? prev - 1 : prev))
    }, [])

    const submitAnswers = useCallback(() => {
        if (!examId) {
            console.error('No exam id to submit')
            return
        }

        if (isPending || isSuccess) {
            return
        }

        const payload: ExamAnswersType = examAnswers ?? {
            examId,
            answers: [],
            startedAt: new Date().toISOString()
        }

        mutate(payload)
    }, [examAnswers, examId, isPending, isSuccess, mutate])

    const onFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!hasAllAnswers) return
        submitAnswers()
    }, [hasAllAnswers, submitAnswers])

    useEffect(() => {
        // Stop countdown once a submission succeeds (auto-submit or manual).
        if (isSuccess || submissionResult) return

        const intervalId = setInterval(() => {
            setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [isSuccess, submissionResult])

    useEffect(() => {
        if (remainingSeconds !== 0 || timeoutSubmittedRef.current) {
            return
        }
        timeoutSubmittedRef.current = true
        submitAnswers()
    }, [remainingSeconds, submitAnswers])


    return (
        <div className="px-5">
            <GeneralHeader>
                <CircleQuestionMark size={45} /> {examTitle} Questions
            </GeneralHeader>
            <div className="flex justify-between gap-12 mb-3 sticky top-10">
                <div className="grow space-y-1.5">
                    <div className="flex justify-between">
                        <p>{diplomaName} - {examTitle}</p>
                        <p className="text-sm text-gray-500">Question <span className="text-blue-600 font-bold">{questionNumber + 1}</span> of {totalQuestions}</p>
                    </div>
                    <Progress value={examProgress} className="rounded-none h-4 bg-blue-50 *:bg-blue-600" />
                </div>
                {!submissionResult &&
                    <div className="w-1/12 text-right">
                        <CircularProgressbar maxValue={totalTimerSeconds} value={timerProgress} counterClockwise styles={circularProgressStyles} text={timerText} />
                    </div>}
            </div>
            {isLoading ? 'Loading questions...' :
                <>
                    {!submissionResult ?
                        <form onSubmit={onFormSubmit} className="flex flex-col justify-between h-[50dvh]">
                            <FieldSet>
                                <FieldLegend variant="legend" className="text-blue-600 data-[variant=legend]:text-2xl font-semibold mb-4">{currentQuestion?.text}</FieldLegend>
                                <RadioGroup className="space-y-2.5" value={currentAnswer?.answerId ?? ''} onValueChange={handleAnswerChange}>
                                    {currentQuestion?.answers?.map((answer) => (
                                        <Field key={answer.id} orientation={"horizontal"} className="**:text-gray-800 **:text-sm ">
                                            <RadioGroupItem value={answer.id} id={`${currentQuestion?.id}-${answer.id}`} className="test border border-gray-400 aria-checked:border-blue-600 aria-checked:**:fill-blue-600 aria-checked:**:stroke-blue-600" />
                                            <FieldLabel htmlFor={`${currentQuestion?.id}-${answer.id}`} className="text-gray-800">{answer.text}</FieldLabel>
                                        </Field>
                                    ))}
                                </RadioGroup>
                            </FieldSet>
                            <div className="mt-10 w-full">
                                <Button key={'previous'} type="button" variant={"secondary"} className="w-1/2" onClick={prevQuestion} disabled={questionNumber === 0}>Previous</Button>
                                {(questionNumber + 1) < totalQuestions ?
                                    <Button key={'next'} type="button" className="w-1/2 text-white bg-blue-600 hover:bg-blue-800 rounded-none disabled:bg-blue-300 disabled:cursor-not-allowed" onClick={nextQuestion}>Next <ChevronRight size={18} /></Button>
                                    :
                                    <Button key={'submit'} type="submit" className="w-1/2 text-white bg-blue-600 hover:bg-blue-800 rounded-none" disabled={!hasAllAnswers || isPending}>Submit</Button>
                                }
                            </div>
                        </form>
                        :
                        <ResultsComponent results={submissionResult} />
                    }
                </>
            }
        </div>
    )
}
