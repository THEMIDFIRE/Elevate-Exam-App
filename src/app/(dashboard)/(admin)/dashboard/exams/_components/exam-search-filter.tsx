import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Input } from '@/shared/components/ui/input'
import { getDiplomas } from '@/shared/lib/api/diplomas/allDiplomas.api'
import { Immutability } from '@/shared/lib/constants/filters.constant'
import { useQuery } from '@tanstack/react-query'
import { ChevronsDownUp, SlidersHorizontal } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'

interface SearchFilterTypes {
    setSearchTitle: (searchTitle: string) => void
    setDiplomaId: (setDiplomaId: string | null) => void
    setImmutabilityFilter: (setImmutabilityFilter: boolean | null) => void
}

type DiplomaFilter = {
    id: string
    title: string
}

export default function ExamSearchFilters({ setSearchTitle, setDiplomaId, setImmutabilityFilter }: SearchFilterTypes) {
    const [searchTitleDraft, setSearchTitleDraft] = useState('')

    const [diplomaInputDraft, setDiplomaInputDraft] = useState('')
    const [diplomaFilterDraft, setDiplomaFilterDraft] = useState<string | null>(null)
    
    const [immutabilityInputDraft, setImmutabilityInputDraft] = useState('')
    const [immutabilityFilterDraft, setImmutabilityFilterDraft] = useState<boolean | null>(null)

    const limit = 100

    const { data: diplomasData } = useQuery({
        queryKey: ['diplomasFilter'],
        queryFn: () => getDiplomas(limit)
    })

    const diplomaFilters = useMemo<DiplomaFilter[]>(() => {
        const diplomas = diplomasData?.payload?.data ?? []
        return diplomas.map((diploma) => ({ id: diploma.id, title: diploma.title }))
    }, [diplomasData])

    function searchFilters(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSearchTitle(searchTitleDraft)
        setDiplomaId(diplomaFilterDraft)
        setImmutabilityFilter(immutabilityFilterDraft)
    }

    function clearFilters() {
        setSearchTitleDraft('')
        setDiplomaInputDraft('')
        setDiplomaFilterDraft(null)
        setImmutabilityInputDraft('')
        setImmutabilityFilterDraft(null)
        setSearchTitle('')
        setDiplomaId(null)
        setImmutabilityFilter(null)
    }

    function handleSearchInputChange(value: string) {
        setDiplomaInputDraft(value)
        const matchedDiploma = diplomaFilters.find((diploma) => diploma.title === value)
        setDiplomaFilterDraft(matchedDiploma?.id ?? null)
    }

    function handleSelectDiploma(id: string, title: string) {
        setDiplomaFilterDraft(id)
        setDiplomaInputDraft(title)
    }

    function handleImmutability(item: boolean | null) {
        setImmutabilityFilterDraft(item)
    }

    function handleImmutabilityLabel(label: string) {
        setImmutabilityInputDraft(label)
        if (label === 'None') return handleImmutability(null)
        if (label === 'Immutable') return handleImmutability(true)
        if (label === 'Mutable') return handleImmutability(false)
        return handleImmutability(null)
    }

    return (
        <Accordion type="single" collapsible defaultValue="item-1" className='mt-5.5'>
            <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline [&_.lucide-chevron-down]:hidden bg-blue-600 rounded-none text-white p-2">
                    <span className="flex items-center gap-1.5">
                        <SlidersHorizontal className="AccordionChevron" /> Search & Filters
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ChevronsDownUp size={14} /> Hide
                    </span>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                    <form className="space-y-2.5" onSubmit={searchFilters}>
                        <Input placeholder="Search by title" name="searchTitle" value={searchTitleDraft} onChange={(e) => setSearchTitleDraft(e.currentTarget.value)} />
                        <div className="flex items-center gap-2.5 max-w-4/5">
                            <div className="max-w-1/2">
                                <Combobox>
                                    <ComboboxInput
                                        placeholder="Diploma"
                                        name="diploma"
                                        value={diplomaInputDraft}
                                        onChange={(e) => handleSearchInputChange(e.currentTarget.value)}
                                        readOnly
                                    />
                                    <ComboboxContent>
                                        <ComboboxList>
                                            {diplomaFilters.map(({ id, title }) => (
                                                <ComboboxItem key={id} value={title} onClick={() => handleSelectDiploma(id, title)}>
                                                    {title}
                                                </ComboboxItem>
                                            ))}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="max-w-1/2">
                                <Combobox items={Immutability}>
                                    <ComboboxInput placeholder="Immutability" name="immutability" value={immutabilityInputDraft} readOnly />
                                    <ComboboxContent>
                                        <ComboboxEmpty>Immutability</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item} value={item} onClick={() => handleImmutabilityLabel(item)}>
                                                    {item}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        </div>
                        <div className="text-right">
                            <Button type="reset" variant={"ghost"} onClick={clearFilters}>Clear</Button>
                            <Button type="submit" variant={"secondary"}>Apply</Button>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion >
    )
}
