'use client'
import { Button } from '@/shared/components/ui/button';
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/shared/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import type { Results } from '@/shared/lib/types/results';
import { FolderSearch, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type ResultsComponentProps = {
    results: Results;
};

export default function ResultsComponent({ results }: ResultsComponentProps) {
    const router = useRouter()

    const totalQuestions = Number(results.payload.submission.totalQuestions)
    const correctAnswers = Number(results.payload.submission.correctAnswers)
    const wrongAnswers = Number(results.payload.submission.wrongAnswers)
    const analytics = results.payload.analytics

    return (
        <>
            <div>
                <h3 className='text-2xl font-semibold text-blue-600'>Results:</h3>
                <div className="grid grid-cols-[180px_1fr] gap-12 py-4">
                    <div className='flex flex-col items-center sticky top-1/4'>
                        <CircularProgressbar
                            maxValue={totalQuestions} value={correctAnswers}
                            counterClockwise
                            strokeWidth={18}
                            styles={buildStyles({ strokeLinecap: 'butt', rotation: 0.25, pathColor: 'rgba(0, 188, 125, 1)', trailColor: 'rgba(239, 68, 68, 1)' })} />
                        <div className='*:flex *:items-center *:gap-1 mt-6'>
                            <p>
                                <span className='size-4 block bg-emerald-500'></span>
                                Correct: {correctAnswers}
                            </p>
                            <p>
                                <span className='size-4 block bg-red-500'></span>
                                Incorrect: {wrongAnswers}
                            </p>
                        </div>
                    </div>
                    <div className='space-y-6'>
                        {analytics.map((analysis) => (
                            <FieldSet key={analysis.questionId}>
                                <FieldLegend variant="legend" className="text-blue-600 data-[variant=legend]:text-xl font-semibold mb-4">{analysis.questionText}</FieldLegend>
                                <RadioGroup className="space-y-2" defaultValue={`${analysis.selectedAnswer !== null && analysis.selectedAnswer.text}`}>
                                    {analysis.selectedAnswer !== null &&<Field orientation={"horizontal"} className="**:text-gray-800 **:text-sm">
                                        <RadioGroupItem value={analysis.selectedAnswer.text} disabled id={analysis.selectedAnswer.text} aria-invalid={!analysis.isCorrect} className="test border border-red-600 aria-checked:border-red-600 aria-checked:**:fill-red-600 aria-checked:**:stroke-red-600" />
                                        <FieldLabel htmlFor={analysis.selectedAnswer.text} className="text-gray-800">{analysis.selectedAnswer.text}</FieldLabel>
                                    </Field>}
                                    <Field orientation={"horizontal"} className="**:text-gray-800 **:text-sm">
                                        <RadioGroupItem value={analysis.correctAnswer.id} disabled id={analysis.correctAnswer.id} className="test border border-emerald-400 aria-checked:border-emerald-600 aria-checked:**:fill-emerald-600 aria-checked:**:stroke-emerald-600" />
                                        <FieldLabel htmlFor={analysis.correctAnswer.id} className="text-gray-800">{analysis.correctAnswer.text}</FieldLabel>
                                    </Field>
                                </RadioGroup>
                            </FieldSet>
                        ))}
                    </div>
                </div>
                <div className='flex gap-4 my-4'>
                    <Button variant={'secondary'} type='button' onClick={() => window.location.reload()} className='w-1/2 rounded-none h-10 bg-transparent  hover:border-2 hover:border-blue-600 duration-100'>
                        <RotateCcw size={18} /> Restart
                    </Button>
                    <Button variant={'secondary'} type='button' onClick={() => router.back()} className='w-1/2 rounded-none h-10 bg-blue-600 text-white hover:bg-blue-800 duration-100'>
                        <FolderSearch size={18} /> Explore
                    </Button>
                </div>
            </div>
        </>
    )
}
