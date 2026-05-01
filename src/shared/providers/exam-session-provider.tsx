'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ExamSession = {
  examId: string
  durationMinutes: number
  startedAt: string
}

type ExamSessionContextValue = {
  startExamSession: (examId: string, durationMinutes: number) => void
  getExamSession: (examId: string) => ExamSession | undefined
}

const ExamSessionContext = createContext<ExamSessionContextValue | null>(null)

export function ExamSessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionsByExamId, setSessionsByExamId] = useState<Record<string, ExamSession>>({})

  const startExamSession = useCallback((examId: string, durationMinutes: number) => {
    if (!examId) return
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return

    setSessionsByExamId(prev => ({
      ...prev,
      [examId]: {
        examId,
        durationMinutes,
        startedAt: new Date().toISOString(),
      },
    }))
  }, [])

  const getExamSession = useCallback(
    (examId: string) => (examId ? sessionsByExamId[examId] : undefined),
    [sessionsByExamId],
  )

  const value = useMemo<ExamSessionContextValue>(
    () => ({
      startExamSession,
      getExamSession,
    }),
    [getExamSession, startExamSession],
  )

  return <ExamSessionContext.Provider value={value}>{children}</ExamSessionContext.Provider>
}

export function useExamSession() {
  const ctx = useContext(ExamSessionContext)
  if (!ctx) {
    throw new Error('useExamSession must be used within an ExamSessionProvider')
  }
  return ctx
}

