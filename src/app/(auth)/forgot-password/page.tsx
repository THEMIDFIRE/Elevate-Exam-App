"use client"
import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { ForgotPassword } from '@/shared/lib/api/forgot-password/forgotPass.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import VerifyOTP from './_components/verify-otp'


const schema = z.object({
    email: z.string().email("Please enter a valid email"),
})

type FormData = z.infer<typeof schema>

const InterFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function ForgotPasswordPage() {
    const [userEmail, setUserEmail] = useState<string>('')
    const [showConfirmation, setShowConfirmation] = useState(false)


    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        setTimeout(() => {
            setFocus('email')
        }, 100)
    }, [setFocus])


    const { mutate: forgotPass, isPending } = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await ForgotPassword(data.email)
            return { res, email: data.email }
        },
        onSuccess: ({ res, email }) => {
            toast.success(res.message)
            setUserEmail(email)
            setShowConfirmation(true)
        },
        onError: (error) => {
            console.error('Email verification failed:', error)
            toast.error(error instanceof Error ? error.message : 'An error occurred')
        }
    })

    return (
        <>
            {showConfirmation ?
                <VerifyOTP onBack={() => setShowConfirmation(false)} email={userEmail} /> :
                <section>
                    <div className="container flex flex-col justify-center max-w-3/4 mx-auto pt-40">
                        <div className='space-y-2.5 mb-10'>
                            <h2 className={`${InterFont.className} text-3xl font-bold`}>Forgot Password</h2>
                            <p className='text-gray-500'>Don&apos;t worry, we will help you recover your account.</p>
                        </div>
                        <form onSubmit={handleSubmit((data) => forgotPass(data))} className='text-gray-800 space-y-4'>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor='email' className='font-medium'>Email</FieldLabel>
                                    <Input id='email' className='rounded-none border-gray-200 focus-visible:ring' placeholder='user@example.com' {...register('email')} aria-invalid={!!errors.email} />
                                    {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                                </Field>
                            </FieldGroup>
                            <Button className='w-full h-11.5 text-sm font-medium bg-blue-600 text-white rounded-none hover:bg-transparent hover:text-gray-800 border-2 hover:border-blue-600 duration-300 py-3.5 mt-9 mb-10 gap-2.5' disabled={isPending}>
                                {isPending ?
                                    (<Spinner className='w-5 h-5 text-white' />) :
                                    (<>Next <ChevronRight size={16} /></>)}
                            </Button>
                            <p className='text-sm font-medium text-gray-500 text-center'>Don&apos;t have an account? <Link href={'/register'} className='text-blue-600 hover:underline'>Create yours</Link></p>
                        </form>
                    </div>
                </section>
            }
        </>
    )
}