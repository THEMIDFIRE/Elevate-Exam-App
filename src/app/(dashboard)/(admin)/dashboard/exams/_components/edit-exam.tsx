'use client'
import { Button } from '@/shared/components/ui/button'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Progress } from '@/shared/components/ui/progress'
import { Textarea } from '@/shared/components/ui/textarea'
import useUploadImage from '@/shared/hooks/use-upload-image'
import { getDiplomas } from '@/shared/lib/api/diplomas/allDiplomas.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ExternalLink, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import AdminSectionHeader from '../../../_components/shared/header'
import { getExamInfo, updateExam } from '../api/exams.api'
import ImgUploadComponent from './img-upload'
import ExamQuestions from './exam-questions'

const updateExamSchema = z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).max(5_000_000).optional(),
    duration: z.union([z.number().max(100, 'Duration must be less than 100'), z.nan()])
        .optional()
        .transform((value) => (typeof value === 'number' && Number.isNaN(value) ? undefined : value)),
    diplomaId: z.string().trim().optional(),
})

export type UpdateExamFormValues = z.input<typeof updateExamSchema>

type DiplomaFilter = {
    id: string
    title: string
}

export default function EditExamComponent() {
    const [diplomaInputDraft, setDiplomaInputDraft] = useState('')

    const [localImageTitle, setLocalImageTitle] = useState('')
    const [localImageSizeBytes, setLocalImageSizeBytes] = useState<number | null>(null)
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

    const { mutate: uploadImg, isPending: uploadingImg, uploadProgress, data: uploadedImg, reset: resetUploadedImg } = useUploadImage()

    const { register, setValue, handleSubmit, control, trigger, formState: { errors } } = useForm<UpdateExamFormValues>({ mode: 'onChange', resolver: zodResolver(updateExamSchema) })

    const params = useSearchParams()
    const examId = params.get('examId')
    const router = useRouter()

    const limit = 10

    const { data: diplomasData } = useQuery({
        queryKey: ['diplomasFilter', diplomaInputDraft],
        queryFn: () => getDiplomas(limit, 1, undefined, undefined, diplomaInputDraft.trim() || undefined)
    })

    const { data: examData } = useQuery({
        queryKey: ['examData', examId],
        queryFn: () => getExamInfo(examId as string),
        enabled: Boolean(examId),
    })

    const diplomaTitle = examData?.payload.exam.diploma.title
    const diplomaId = examData?.payload.exam.diplomaId
    const examTitle = examData?.payload.exam.title
    const examDescription = examData?.payload.exam.description
    const examDuration = examData?.payload.exam.duration
    const examImg = examData?.payload.exam.image

    const diplomaFilters = useMemo<DiplomaFilter[]>(() => {
        const diplomas = diplomasData?.payload?.data ?? []
        return diplomas.map((diploma) => ({ id: diploma.id, title: diploma.title }))
    }, [diplomasData])

    useEffect(() => {
        return () => {
            if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
        }
    }, [localPreviewUrl])

    useEffect(() => {
        if (!examId) {
            toast.error('Invalid exam id')
            router.push('/dashboard/exams')
        }
    }, [examId, router])

    const { mutate: formSubmit, isPending: editingExam } = useMutation({
        mutationFn: async (data: UpdateExamFormValues) => {
            if (!examId) throw new Error('Invalid exam id')
            const updatedExamPayload: {
                title?: string
                description?: string
                diplomaId?: string
                duration?: number
                image?: string
            } = {}

            const trimmedTitle = data.title?.trim()
            const trimmedDescription = data.description?.trim()
            const trimmedDiplomaId = data.diplomaId?.trim()

            if (trimmedTitle) updatedExamPayload.title = trimmedTitle
            if (trimmedDescription) updatedExamPayload.description = trimmedDescription
            if (trimmedDiplomaId) updatedExamPayload.diplomaId = trimmedDiplomaId
            if (typeof data.duration === 'number' && Number.isFinite(data.duration)) {
                updatedExamPayload.duration = data.duration
            }
            updatedExamPayload.image = uploadedImg?.url ?? examImg

            if (Object.keys(updatedExamPayload).length === 0) {
                throw new Error('No changes to update')
            }

            const res = await updateExam(updatedExamPayload, examId)
            return res
        },
        onSuccess: () => {
            toast.success('Exam successfully updated')
            router.push('/dashboard/exams')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    const onSubmit = async (data: UpdateExamFormValues) => {
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
            <div className="flex items-center justify-between">
                <div>
                    <h3 className='text-lg font-semibold capitalize'>{examData?.payload.exam.title}</h3>
                    <div className='text-gray-300 text-sm flex items-center gap-1'>
                        <span>Diploma:</span>
                        <Link
                            className='underline flex items-center gap-1'
                            href={`/dashboard/diplomas/${diplomaTitle}?diplomaId=${diplomaId}`}>
                            {diplomaTitle} <ExternalLink size={14} />
                        </Link>
                    </div>
                </div>
                <div className='text-right *:rounded-none'>
                    <Button type='button' variant={'ghost'} onClick={() => router.back()}>
                        <X /> Cancel
                    </Button>
                    <Button
                        form='edit-exam'
                        variant={'link'}
                        type='submit'
                        className='bg-emerald-500 text-white'
                        disabled={uploadingImg || editingExam}
                    >
                        <Save /> Save
                    </Button>
                </div>
            </div>

            <AdminSectionHeader>
                Exam Information
            </AdminSectionHeader>

            <form id='edit-exam'
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-5 *:grid *:grid-cols-[1fr_1fr] *:gap-2.5 [&_input]:rounded-none'>
                <div>
                    <Field>
                        <FieldLabel htmlFor='examTitle'>Title</FieldLabel>
                        <Input type='text' id='examTitle' placeholder={examTitle || 'Exam title'}
                            aria-invalid={!!errors.title} {...register('title')}
                            className='border border-gray-200 p-2.5' />
                        <FieldError errors={[errors.title]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='examDiploma'>Diploma</FieldLabel>
                        <Input type="hidden" {...register('diplomaId')} />
                        <Combobox>
                            <ComboboxInput className={'rounded-none'}
                                placeholder={diplomaTitle || 'Diploma'}
                                name="diploma"
                                value={diplomaInputDraft || diplomaTitle || ''}
                                onChange={(e) => handleSearchInputChange(e.currentTarget.value)}
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
                        <FieldError errors={[errors.diplomaId]} />
                    </Field>
                </div>
                <div>
                    <Field>
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
                                    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
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
                                        examImage={examImg}
                                    />
                                )
                            }}
                        />
                        <FieldError errors={[errors.image]} />
                        {uploadingImg && <Progress value={uploadProgress} className='w-full rounded-md *:bg-blue-600 bg-gray-400' />}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='examDescription'>Description</FieldLabel>
                        <Textarea id='examDescription' placeholder={examDescription || 'Exam description'} aria-invalid={!!errors.description} {...register('description')} className='border border-gray-200 p-2.5 rounded-none h-full' />
                        <FieldError errors={[errors.description]} />
                    </Field>
                </div>
                <div>
                    <Field>
                        <FieldLabel htmlFor='examDuration'>Duration (min)</FieldLabel>
                        <Input
                            type='number'
                            id='examDuration'
                            placeholder={examDuration?.toString() || 'Duration (min)'}
                            aria-invalid={!!errors.duration}
                            {...register('duration', {
                                setValueAs: (value) => {
                                    if (value === '' || value === null || value === undefined) return undefined
                                    const parsedValue = Number(value)
                                    return Number.isNaN(parsedValue) ? undefined : parsedValue
                                }
                            })}
                            className='p-2.5'
                        />
                        <FieldError errors={[errors.duration]} />
                    </Field>
                </div>
            </form>

            <ExamQuestions examId={examId} />
        </>
    )
}
