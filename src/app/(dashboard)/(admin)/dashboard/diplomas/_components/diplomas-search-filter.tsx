import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Input } from '@/shared/components/ui/input'
import { Immutability } from '@/shared/lib/constants/filters.constant'
import { ChevronsDownUp, SlidersHorizontal } from 'lucide-react'
import { FormEvent, useState } from 'react'

// Mutable = changeable
// Immutable: false = changeable
// Immutable = unchangeable
// Immutable: true = unchangeable
// None = not specified


export default function DiplomaSearchFilters({ setSearchTitle, setImmutabilityFilter }: { setSearchTitle: (searchTitle: string) => void, setImmutabilityFilter: (setImmutabilityFilter: boolean | null) => void }) {
    const [searchInput, setSearchInput] = useState('')
    const [immutabilityInputDraft, setImmutabilityInputDraft] = useState('')
    const [immutabilityFilterDraft, setImmutabilityFilterDraft] = useState<boolean | null>(null)



    function searchFilters(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSearchTitle(searchInput)
        setImmutabilityFilter(immutabilityFilterDraft)
    }
    function clearFilters() {
        setSearchInput('')
        setSearchTitle('')
        setImmutabilityInputDraft('')
        setImmutabilityFilterDraft(null)
        setImmutabilityFilter(null)
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
                        <Input placeholder="Search by title" name="searchTitle" value={searchInput} onChange={(e) => setSearchInput(e.currentTarget.value)} />
                        <div className="max-w-1/4">
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
