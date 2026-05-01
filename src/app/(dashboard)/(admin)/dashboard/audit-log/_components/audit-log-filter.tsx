import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { ActionFilter, CategoryFilter, UserFilter } from '@/shared/lib/constants/filters.constant'
import { useQuery } from '@tanstack/react-query'
import { ChevronsDownUp, SlidersHorizontal } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { getAllUsers } from '../api/get-all-users.api'

interface AuditLogFilterTypes {
    setCategory: (category: string) => void
    setAction: (action: string) => void
    setActorUserId: (actorUserId: string) => void
}

export default function AuditLogFilter({ setCategory, setAction, setActorUserId }: AuditLogFilterTypes) {
    const [categoryInputDraft, setCategoryInputDraft] = useState('')
    const [categoryDraft, setCategoryDraft] = useState('')

    const [actionInputDraft, setActionInputDraft] = useState('')
    const [actionDraft, setActionDraft] = useState('')

    const [actorUserIdDraft, setActorUserIdDraft] = useState('')

    const [userSearchInput, setUserSearchInput] = useState('')

    const { data: users } = useQuery({
        queryKey: ['allUsers', userSearchInput],
        queryFn: () => getAllUsers({ search: userSearchInput })
    })

    function handleUserSelect(id: string) {
        setActorUserIdDraft(id)
    }

    function applyFilters(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setCategory(categoryDraft)
        setAction(actionDraft)
        setActorUserId(actorUserIdDraft)
    }

    function clearFilters() {
        setCategoryInputDraft('')
        setCategoryDraft('')
        setActionInputDraft('')
        setActionDraft('')
        setCategory('')
        setAction('')
        setActorUserId('')
        setActorUserIdDraft('')
    }

    function handleSelectCategory(value: string) {
        setCategoryDraft(value)
        setCategoryInputDraft(value)
    }

    function handleSelectAction(value: string) {
        setActionDraft(value)
        setActionInputDraft(value)
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
                    <form className="space-y-2.5" onSubmit={applyFilters}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-full">
                                <Combobox items={CategoryFilter}>
                                    <ComboboxInput
                                        placeholder="Category"
                                        name="Category"
                                        value={categoryInputDraft}
                                        readOnly
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>Category</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item} value={item} onClick={() => handleSelectCategory(item)}>
                                                    {item}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="w-full">
                                <Combobox items={ActionFilter}>
                                    <ComboboxInput
                                        placeholder="Action"
                                        name="Action"
                                        value={actionInputDraft}
                                        readOnly
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>Action</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item} value={item} onClick={() => handleSelectAction(item)}>
                                                    {item}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="w-full">
                                <Combobox items={UserFilter}>
                                    <ComboboxInput placeholder="User" name="User" onChange={(e) => setUserSearchInput(e.target.value)} />
                                    <ComboboxContent>
                                        <ComboboxList>
                                            {users?.payload.data.map(({ id, username }) => (
                                                <ComboboxItem key={id} value={username} onClick={() => handleUserSelect(id)}>
                                                    {username}
                                                </ComboboxItem>
                                            ))}
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
