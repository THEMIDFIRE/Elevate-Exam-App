'use client'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { useQuery } from '@tanstack/react-query'
import { FormEvent, useMemo, useState } from 'react'
import { getDiplomas } from '../lib/api/diplomas/allDiplomas.api'
import { getExams } from '../lib/api/exams/exams.api'

type DiplomaOption = {
    id: string
    title: string
}

export default function DiplomaSelectorFilter() {
    const [searchInput, setSearchInput] = useState('')
    const [selectedDiplomaId, setSelectedDiplomaId] = useState<string | null>(null)
    const [appliedDiplomaId, setAppliedDiplomaId] = useState<string | null>(null)

    const { data: diplomasData, isLoading: loadingDiplomas, isError: diplomasError } = useQuery({
        queryKey: ['diplomasFilter'],
        queryFn: () => getDiplomas(10, 1)
    })

    const diplomaOptions = useMemo<DiplomaOption[]>(() => {
        const diplomas = diplomasData?.payload?.data ?? []
        return diplomas.map((diploma) => ({ id: diploma.id, title: diploma.title }))
    }, [diplomasData])

    const {
        data: examsData,
        isFetching: fetchingExams,
        isError: examsError
    } = useQuery({
        queryKey: ['testExamsByDiploma', appliedDiplomaId],
        queryFn: () => getExams(10, 1, appliedDiplomaId ?? undefined),
        enabled: false
    })

    function handleSearchInputChange(value: string) {
        setSearchInput(value)
        const matchedDiploma = diplomaOptions.find((diploma) => diploma.title === value)
        setSelectedDiplomaId(matchedDiploma?.id ?? null)
    }

    function handleSelectDiploma(id: string, title: string) {
        setSelectedDiplomaId(id)
        setSearchInput(title)
    }

    async function handleApply(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setAppliedDiplomaId(selectedDiplomaId)
        // await refetchExams()
        console.log(searchInput, selectedDiplomaId, appliedDiplomaId);
        
    }

    function handleClear() {
        setSearchInput('')
        setSelectedDiplomaId(null)
        setAppliedDiplomaId(null)
    }

    return (
        <div className="mx-auto max-w-[50%] space-y-3">
            <form onSubmit={handleApply} className='space-y-2.5'>
                <Combobox>
                    <ComboboxInput
                        placeholder="Diploma"
                        name="diploma"
                        value={searchInput}
                        onChange={(e) => handleSearchInputChange(e.currentTarget.value)}
                        showClear
                    />
                    <ComboboxContent>
                        <ComboboxEmpty>No diplomas found</ComboboxEmpty>
                        <ComboboxList>
                            {diplomaOptions.map(({ id, title }) => (
                                <ComboboxItem key={id} value={title} onClick={() => handleSelectDiploma(id, title)}>
                                    {title}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
                <div className='flex items-center justify-end gap-2'>
                    <button type='button' onClick={handleClear} className='cursor-pointer text-sm text-muted-foreground hover:text-foreground'>
                        Clear
                    </button>
                    <button type='submit' className='cursor-pointer rounded-sm bg-secondary px-3 py-1 text-sm text-secondary-foreground'>
                        Apply
                    </button>
                </div>
            </form>

            {loadingDiplomas && <p className='text-sm text-muted-foreground'>Loading diplomas...</p>}
            {diplomasError && <p className='text-sm text-destructive'>Failed to load diplomas.</p>}

            <div className='space-y-1'>
                {fetchingExams && <p className='text-sm text-muted-foreground'>Loading exams...</p>}
                {examsError && <p className='text-sm text-destructive'>Failed to load exams.</p>}
                {examsData?.payload?.data?.map((exam) => (
                    <p key={exam.id} className='text-sm'>
                        {exam.title}
                    </p>
                ))}
            </div>
        </div>
    )
}
