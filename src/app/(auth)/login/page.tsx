"use client"
import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CircleX, Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'


const schema = z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password is required"),
})

type FormData = z.infer<typeof schema>

const InterFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const params = useSearchParams()


    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        setFocus('username')
    }, [setFocus])

    const { mutate: userLogin, isPending } = useMutation({
        mutationFn: async (data: FormData) => {
            const callbackUrl = params.get('callbackUrl') || '/'
            const res = await signIn('credentials', {
                username: data.username,
                password: data.password,
                redirect: false,
                callbackUrl,
            })
            if (res?.error) {
                throw new Error(res.error)
            }
            if (!res?.ok) {
                throw new Error('Login failed')
            }
            return callbackUrl
        },
        onError: (err: Error) => {
            setError(err.message)
        },
        onSuccess: (callbackUrl) => {
            toast.success('Login successful!')
            router.replace(callbackUrl)
            router.refresh()
        }
    })

    return (
        <>
            <section>
                <div className="container flex flex-col justify-center max-w-3/4 mx-auto pt-40">
                    <h2 className={`${InterFont.className} text-3xl font-bold mb-10`}>Login</h2>
                    <form onSubmit={handleSubmit((data) => userLogin(data))} className='text-gray-800'>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor='username'>Username</FieldLabel>
                                <Input id='username' className='rounded-none border-gray-200 focus-visible:ring' placeholder='user123' {...register('username')} aria-invalid={!!errors.username} />
                                {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
                            </Field>
                        </FieldGroup>
                        <FieldGroup className='mb-2.5 mt-4'>
                            <Field>
                                <FieldLabel htmlFor='password'>Password</FieldLabel>
                                <div className="relative">
                                    <Input id='password' className='rounded-none border-gray-200 focus-visible:ring' type={showPassword ? "text" : "password"} placeholder='********' {...register('password')} aria-invalid={!!errors.password} />
                                    {!showPassword ? (
                                        <EyeOff className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
                                    ) : (
                                        <Eye className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
                                    )}
                                </div>
                                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
                            </Field>
                        </FieldGroup>
                        <div className="flex justify-end mb-10">
                            <Link href={'/forgot-password'} className='text-sm text-blue-600'>Forgot your password?</Link>
                        </div>
                        {error &&
                            <div className="relative text-center border border-red-600 w-full p-2.5 mb-9">
                                <CircleX className='text-red-600 fill-white absolute left-1/2 top-0 -translate-y-1/2' size={18} />
                                <p className='text-sm text-red-600'>{error}</p>
                            </div>}
                        <Button className='w-full rounded-none bg-blue-600 font-medium text-sm text-white hover:bg-transparent hover:text-gray-800 border-2 hover:border-blue-600 duration-300 ' disabled={isPending}>
                            {isPending ?
                                <Spinner className='w-5 h-5 text-white' /> :
                                'Login'
                            }
                        </Button>
                        <p className='text-sm font-medium text-gray-500 text-center mt-9'>Don&apos;t have an account? <Link href={'/register'} className='text-blue-600 hover:underline'>Create yours</Link></p>
                    </form>
                </div>
            </section>
        </>
    )
}