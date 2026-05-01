"use client"
import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { ResetPassword } from '@/shared/lib/api/reset-password/resetPass.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'


const schema = z.object({
    newPassword: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z.string().min(8, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type FormData = z.infer<typeof schema>

const InterFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function ResetPasswordComponent() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const params = useSearchParams()
    const router = useRouter()


    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })
    const token = params.get('token')

    useEffect(() => {
        setTimeout(() => {
            setFocus('newPassword')
        }, 1000);
    }, [setFocus])


    const { mutate: resetPass, isPending } = useMutation({
        mutationFn: async (data: FormData) => {
            if (!token) {
                toast.error('Invalid or missing token')
                return
            }
            const dataToSend = {
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }
            const res = await ResetPassword(dataToSend)
            return res
        },
        onSuccess: (res) => {
            toast.success(res?.message)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        },
        onError: (error) => {
            toast.error((error as Error).message)
        }
    })

    return (
        <section>
            <div className="container flex flex-col justify-center max-w-3/4 mx-auto py-36.25">
                <h2 className={`${InterFont.className} text-3xl font-bold mb-10`}>Create a New Password</h2>
                <form onSubmit={handleSubmit((data) => resetPass(data))} className='text-gray-800 space-y-4'>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                            <div className="relative">
                                <Input id='newPassword' className='rounded-none border-gray-200 focus-visible:ring' type={showPassword ? "text" : "password"} placeholder='********' {...register('newPassword')} aria-invalid={!!errors.newPassword} />
                                {!showPassword ? (
                                    <EyeOff className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
                                ) : (
                                    <Eye className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
                                )}
                            </div>
                            {errors.newPassword && <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>}
                        </Field>
                    </FieldGroup>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='confirmPassword'>Confirm New Password</FieldLabel>
                            <div className="relative">
                                <Input id='confirmPassword' className='rounded-none border-gray-200 focus-visible:ring' type={showConfirmPassword ? "text" : "password"} placeholder='********' {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
                                {!showConfirmPassword ? (
                                    <EyeOff className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowConfirmPassword((prev) => !prev)} />
                                ) : (
                                    <Eye className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowConfirmPassword((prev) => !prev)} />
                                )}
                            </div>
                            {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
                        </Field>
                    </FieldGroup>
                    <Button className='w-full h-11.5 rounded-none bg-blue-600 hover:bg-transparent hover:text-gray-800 text-white font-medium text-sm border-2 hover:border-blue-600 duration-300 py-3.5 mb-9 mt-10' disabled={isPending}>
                        {isPending ?
                            <Spinner className='w-5 h-5 text-white' /> :
                            'Reset Password'
                        }
                    </Button>
                    <p className='text-sm font-medium text-gray-500 text-center'>Already have an account? <Link href={'/login'} className='text-blue-600 hover:underline'>Login</Link></p>
                </form>
            </div>
        </section>
    )
}