export type Results = {
    status:  boolean;
    code:    number;
    payload: Payload;
}

export type Payload = {
    submission: Submission;
    analytics:  Analytics[];
}

export type Analytics = {
    questionId:     string;
    questionText:   string;
    selectedAnswer: Answer;
    isCorrect:      boolean;
    correctAnswer:  Answer;
}

export type Answer = {
    id:   string;
    text: string;
}

export type Submission = {
    id:             string;
    examId:         string;
    examTitle:      string;
    score:          number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers:   number;
    submittedAt:    Date;
}
