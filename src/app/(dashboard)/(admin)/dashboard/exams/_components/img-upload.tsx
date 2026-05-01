'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { CloudUpload, Download, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { DragEvent, useRef, useState } from 'react'

type ImgUploadProps = {
    previewUrl: string | null
    imageTitle: string
    imageSizeBytes: number | null
    onSelectFile: (file?: File) => Promise<void> | void
    onClearFile: () => void
    examImage?: string
}

function formatFileSize(bytes: number | null) {
    if (bytes === null) return '--'
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${bytes} B`
}

export default function ImgUploadComponent({ previewUrl, imageTitle, imageSizeBytes, onSelectFile, onClearFile, examImage}: ImgUploadProps) {
    const path = usePathname()
    
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    
    const previewImg = previewUrl ?? examImage
    const formatImgTitle = examImage?.split('/').pop()
    const currentImgTitle = imageTitle || formatImgTitle

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        await onSelectFile(e.dataTransfer.files?.[0])
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
                id='examImg'
                className='hidden'
                type='file'
                name='image'
                accept='.png, .jpg, .jpeg, .webp'
                ref={inputRef}
                onChange={async (e) => {
                    await onSelectFile(e.target.files?.[0])
                }}
            />
            {previewImg ? (
                <div className='flex items-center gap-5'>
                    <div className='relative size-21.5'>
                        <Image
                            src={previewImg}
                            alt='Exam preview'
                            fill
                            unoptimized
                            className='object-scale-down'
                        />
                    </div>
                    <p className='truncate grow'>{currentImgTitle}</p>
                    <div className='flex items-center w-fit space-x-1'>
                        <p className='text-gray-400 text-xs'>{formatFileSize(imageSizeBytes)}</p>
                        <div className='w-px h-4.5 bg-gray-200'></div>
                        <div className='flex items-center'>
                            {path.includes('edit') &&
                                <Button
                                    type='button'
                                    variant={'ghost'}
                                    className='text-blue-600'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download size={18} />
                                </Button>}
                            <Button
                                type='button'
                                variant='ghost'
                                className='text-red-600'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onClearFile()
                                    if (inputRef.current) inputRef.current.value = ''
                                }}
                                aria-label='Remove selected image'
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
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
}
