'use client'
import { Button } from '@/shared/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Progress } from '@/shared/components/ui/progress'
import useUploadImage from '@/shared/hooks/use-upload-image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CloudUpload, Save, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { DragEvent, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { getDiplomaInfo, updateDiploma } from '../api/diplomas.api'
import AdminSectionHeader from '../../../_components/shared/header'

const newDiplomaSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z
        .file()
        .mime(['image/png', 'image/jpeg', 'image/webp'])
        .max(5_000_000)
        .optional(),
})

export type EditDiplomaFormValues = z.infer<typeof newDiplomaSchema>

export default function EditDiplomaComponent() {
    const params = useSearchParams()
    const diplomaId = params.get('diplomaId')

    const router = useRouter()

    const { register, control, handleSubmit, trigger, formState: { errors } } = useForm<EditDiplomaFormValues>({
        mode: 'onChange',
        resolver: zodResolver(newDiplomaSchema)
    })
    const { mutate: uploadImg, isPending: uploadingImg, uploadProgress, data: uploadedImg } = useUploadImage()

    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

    const { data, isFetching } = useQuery({
        queryKey: ['diploma', diplomaId],
        queryFn: () => getDiplomaInfo(diplomaId as string),
    })

    const diplomaImg = data?.payload.diploma.image
    const diplomaTitle = data?.payload.diploma.title
    const diplomaDescription = data?.payload.diploma.description

    useEffect(() => {
        return () => {
            if (localPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(localPreviewUrl)
        }
    }, [localPreviewUrl])

    const previewUrl = localPreviewUrl ?? diplomaImg ?? null



    const { mutate: formSubmit, isPending: addingDiploma } = useMutation({
        mutationFn: async (data: EditDiplomaFormValues) => {
            const newDiplomaData: {
                title?: string
                description?: string
                image?: string
            } = {}

            const trimmedTitle = data.title?.trim()
            const trimmedDescription = data.description?.trim()

            if (trimmedTitle) newDiplomaData.title = trimmedTitle
            if (trimmedDescription) newDiplomaData.description = trimmedDescription
            if (uploadedImg?.url) newDiplomaData.image = uploadedImg.url

            if (Object.keys(newDiplomaData).length === 0) {
                throw new Error('No changes to update')
            }

            const res = await updateDiploma(newDiplomaData, diplomaId as string)
            return res
        },
        onSuccess: () => {
            toast.success('Diploma successfully updated')
            router.push('/dashboard/diplomas')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    const onSubmit = async (data: EditDiplomaFormValues) => {
        formSubmit(data)
    }


    return (
        <>
            <div className='text-right *:rounded-none'>
                <Button type='button' variant={'ghost'} onClick={(() => router.back())}>
                    <X /> Cancel
                </Button>
                <Button
                    form='add-diploma'
                    variant={'link'}
                    type='submit'
                    className='bg-emerald-500 text-white'
                    disabled={uploadingImg || addingDiploma}
                >
                    <Save /> Save
                </Button>
            </div>

            <AdminSectionHeader>
                Diploma Information
            </AdminSectionHeader>

            <form id='add-diploma' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <Field>
                    <FieldLabel htmlFor='diplomaImg'>Image</FieldLabel>
                    <Controller
                        name='image'
                        control={control}
                        render={({ field: { onChange } }) => {
                            const handleSelectedFile = async (file?: File) => {
                                if (!file) return
                                onChange(file)
                                const isValid = await trigger('image')
                                if (isValid) {
                                    setLocalPreviewUrl((prevUrl) => {
                                        if (prevUrl) URL.revokeObjectURL(prevUrl)
                                        return URL.createObjectURL(file)
                                    })
                                    uploadImg(file)
                                }
                            }

                            const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
                                e.preventDefault()
                                setIsDragging(false)
                                const file = e.dataTransfer.files?.[0]
                                await handleSelectedFile(file)
                            }

                            return (
                                <div
                                    onClick={() => inputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setIsDragging(true)
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault()
                                        setIsDragging(true)
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className='cursor-pointer'
                                >

                                    <Input
                                        className='hidden'
                                        type='file'
                                        name='image'
                                        accept='.png, .jpg, .jpeg, .webp'
                                        ref={inputRef}
                                        onChange={
                                            async (e) => {
                                                await handleSelectedFile(e.target.files?.[0])
                                            }
                                        }
                                    />
                                    {previewUrl ? (
                                        <div>
                                            <div className='relative size-60'>
                                                <Image
                                                    src={previewUrl}
                                                    alt='Diploma preview'
                                                    fill
                                                    unoptimized
                                                    className='object-scale-down'
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`border p-6 flex items-center justify-center gap-1 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                            <CloudUpload />
                                            <p className='text-gray-600'>
                                                Drop an image here or <span className='text-blue-600'>select from your computer</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        }}
                    />
                    <FieldError errors={[errors.image]} />
                </Field>
                {uploadingImg && <Progress value={uploadProgress} className='w-full rounded-md *:bg-blue-600 bg-gray-400' />}
                <Field>
                    <FieldLabel htmlFor='diplomaTitle'>Title</FieldLabel>
                    <Input
                        type='text'
                        id='diplomaTitle'
                        placeholder={isFetching ? 'Loading...' : diplomaTitle}
                        aria-invalid={!!errors.title}
                        {...register('title')}
                    />
                    <FieldError errors={[errors.title]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor='diplomaDescription'>Description</FieldLabel>
                    <Input
                        type='text'
                        id='diplomaDescription'
                        placeholder={isFetching ? 'Loading...' : diplomaDescription}
                        aria-invalid={!!errors.description}
                        {...register('description')}
                    />
                    <FieldError errors={[errors.description]} />
                </Field>
            </form>
        </>
    )
}
