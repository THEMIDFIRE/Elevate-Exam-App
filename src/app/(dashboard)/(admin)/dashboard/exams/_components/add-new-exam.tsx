'use client'
import { Button } from '@/shared/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Progress } from '@/shared/components/ui/progress'
import useUploadImage from '@/shared/hooks/use-upload-image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Save, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { toast } from 'sonner'
import AdminSectionHeader from '../../../_components/shared/header'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { getDiplomas } from '@/shared/lib/api/diplomas/allDiplomas.api'
import { Textarea } from '@/shared/components/ui/textarea'
import { addNewExam } from '../api/exams.api'
import ImgUploadComponent from './img-upload'

const newExamSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().min(1, 'Description is required'),
    image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).max(5_000_000),
    duration: z.number().min(1, 'Duration is required').max(100, 'Duration must be less than 100'),
    diplomaId: z.string().trim().min(1, 'Diploma is required'),
})

export type NewExamFormValues = z.infer<typeof newExamSchema>

type DiplomaFilter = {
    id: string
    title: string
}

export default function AddNewExamComponent() {
    const [diplomaInputDraft, setDiplomaInputDraft] = useState('')

    const [localImageTitle, setLocalImageTitle] = useState('')
    const [localImageSizeBytes, setLocalImageSizeBytes] = useState<number | null>(null)
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

    const { mutate: uploadImg, isPending: uploadingImg, uploadProgress, data: uploadedImg, reset: resetUploadedImg } = useUploadImage()

    const { register, setValue, handleSubmit, control, trigger, formState: { errors } } = useForm<NewExamFormValues>({ mode: 'onChange', resolver: zodResolver(newExamSchema) })

    const router = useRouter()

    const limit = 100

    const { data: diplomasData } = useQuery({
        queryKey: ['diplomasFilter'],
        queryFn: () => getDiplomas(limit)
    })

    const diplomaFilters = useMemo<DiplomaFilter[]>(() => {
        const diplomas = diplomasData?.payload?.data ?? []
        return diplomas.map((diploma) => ({ id: diploma.id, title: diploma.title }))
    }, [diplomasData])

    const filteredDiplomaFilters = useMemo(() => {
        const q = diplomaInputDraft.trim().toLowerCase()
        if (!q) return diplomaFilters
        return diplomaFilters.filter((d) => d.title.toLowerCase().includes(q))
    }, [diplomaFilters, diplomaInputDraft])

    useEffect(() => {
        return () => {
            if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
        }
    }, [localPreviewUrl])

    const { mutate: formSubmit, isPending: addingExam } = useMutation({
        mutationFn: async (data: NewExamFormValues) => {
            if (!uploadedImg) throw new Error('Image is required')
            const newExam = { ...data, image: uploadedImg.url }
            const res = await addNewExam(newExam)
            return res
        },
        onSuccess: () => {
            toast.success('Exam successfully added')
            router.push('/dashboard/exams')
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const onSubmit = async (data: NewExamFormValues) => {
        formSubmit(data)
    }

    function handleSearchInputChange(value: string) {
        setDiplomaInputDraft(value)
        const matchedDiploma = diplomaFilters.find((diploma) => diploma.title === value)
        setValue('diplomaId', matchedDiploma?.id ?? '', { shouldValidate: true })
    }

    function handleSelectDiploma(id: string, title: string) {
        setDiplomaInputDraft(title)
        setValue('diplomaId', id, { shouldValidate: true })
    }



    return (
        <>
            <div className='text-right *:rounded-none'>
                <Button type='button' variant={'ghost'} onClick={() => router.back()}>
                    <X /> Cancel
                </Button>
                <Button
                    form='add-exam'
                    variant={'link'}
                    type='submit'
                    className='bg-emerald-500 text-white'
                    disabled={uploadingImg || addingExam}
                >
                    <Save /> Save
                </Button>
            </div>

            <AdminSectionHeader>
                Exam Information
            </AdminSectionHeader>

            <form id='add-exam'
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-5 [&_.flex]:gap-2.5 [&_input]:rounded-none'>
                <div className="flex">
                    <Field>
                        <FieldLabel htmlFor='examTitle'>Title</FieldLabel>
                        <Input type='text' id='examTitle' placeholder='Exam title' aria-invalid={!!errors.title} {...register('title')} className='border border-gray-200 p-2.5' />
                        <FieldError errors={[errors.title]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='examDiploma'>Diploma</FieldLabel>
                        <input type="hidden" {...register('diplomaId')} />
                        <Combobox>
                            <ComboboxInput className={'rounded-none'}
                                placeholder="Diploma"
                                name="diploma"
                                value={diplomaInputDraft}
                                onChange={(e) => handleSearchInputChange(e.currentTarget.value)}
                            />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filteredDiplomaFilters.map(({ id, title }) => (
                                        <ComboboxItem key={id} value={title} onClick={() => handleSelectDiploma(id, title)}>
                                            {title}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldError errors={[errors.diplomaId]} />
                    </Field>
                </div>
                <div className='flex'>
                    <Field className='w-1/2'>
                        <FieldLabel htmlFor='examImg'>Image</FieldLabel>
                        <Controller
                            name='image'
                            control={control}
                            render={({ field: { onChange } }) => {
                                const handleSelectedFile = async (file?: File) => {
                                    if (!file) return
                                    setLocalImageSizeBytes(file.size)
                                    onChange(file)
                                    const isValid = await trigger('image')
                                    if (!isValid) return

                                    setLocalImageTitle(file.name)
                                    setLocalPreviewUrl((prevUrl) => {
                                        if (prevUrl) URL.revokeObjectURL(prevUrl)
                                        return URL.createObjectURL(file)
                                    })
                                    uploadImg(file)
                                }

                                const handleClearSelectedFile = () => {
                                    setLocalPreviewUrl(null)
                                    setLocalImageTitle('')
                                    setLocalImageSizeBytes(null)
                                    onChange(undefined)
                                    resetUploadedImg()
                                }

                                return (
                                    <ImgUploadComponent
                                        previewUrl={localPreviewUrl}
                                        imageTitle={localImageTitle}
                                        imageSizeBytes={localImageSizeBytes}
                                        onSelectFile={handleSelectedFile}
                                        onClearFile={handleClearSelectedFile}
                                    />
                                )
                            }}
                        />
                        <FieldError errors={[errors.image]} />
                        {uploadingImg && <Progress value={uploadProgress} className='w-full rounded-md *:bg-blue-600 bg-gray-400' />}
                    </Field>
                    <Field className='w-1/2'>
                        <FieldLabel htmlFor='examDescription'>Description</FieldLabel>
                        <Textarea id='examDescription' placeholder='Exam description' aria-invalid={!!errors.description} {...register('description')} className='border border-gray-200 p-2.5 rounded-none h-full' />
                        <FieldError errors={[errors.description]} />
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor='examDuration'>Duration (min)</FieldLabel>
                    <Input
                        type='number'
                        id='examDuration'
                        aria-invalid={!!errors.duration}
                        {...register('duration', { valueAsNumber: true })}
                        className='max-w-1/2 p-2.5'
                    />
                    <FieldError errors={[errors.duration]} />
                </Field>
            </form>
        </>
    )
}
