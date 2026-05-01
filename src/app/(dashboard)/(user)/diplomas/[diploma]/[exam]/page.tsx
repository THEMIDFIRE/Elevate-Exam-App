import ExamQuestions from "../../../_components/exam-questions";

export default function QuestionsPage({ searchParams }: { searchParams: { examId?: string } }) {
    return (
        <ExamQuestions key={searchParams?.examId ?? 'exam'} />
    )
}
