import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type PasswordInfo = z.infer<typeof schema>

interface PasswordInfoProps {
    onSubmit: (passwordData: PasswordInfo) => void
    isLoading?: boolean
}

export default function PasswordStep({ onSubmit, isLoading }: PasswordInfoProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)


    const { register, handleSubmit, formState: { errors } } = useForm<PasswordInfo>({
        resolver: zodResolver(schema)
    })

    function handlePasswordSubmit(passwordData: PasswordInfo) {
        onSubmit(passwordData)
    }

    return (
        <>
            <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                <FieldGroup>
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
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
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
                <Button className='w-full bg-transparent rounded-none border border-blue-600 hover:bg-blue-600 hover:text-white duration-300 text-gray-800 mt-9 mb-10 gap-2.5' disabled={isLoading}>
                    {isLoading ?
                        <Spinner className='w-5 h-5 text-blue-600' /> :
                        'Create Account'
                    }
                </Button>
            </form>
        </>
    )
}
