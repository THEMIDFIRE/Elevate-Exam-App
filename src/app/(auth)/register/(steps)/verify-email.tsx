import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


const schema = z.object({
    email: z.email({ error: "Please enter a valid email" }),
})

type EmailData = z.infer<typeof schema>

interface EmailStepProps {
    onSubmit: (email: string) => void;
    isLoading?: boolean;
}

export default function VerifyEmailStep({ onSubmit, isLoading }: EmailStepProps) {

    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<EmailData>({
        resolver: zodResolver(schema)
    })

    async function emailSubmit(data: EmailData) {
        await onSubmit(data.email)
    }

    useEffect(() => {
        setTimeout(() => {
            setFocus('email')
        }, 100);
    }, [setFocus])


    return (
        <form onSubmit={handleSubmit(emailSubmit)}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input id='email'
                        className='rounded-none border-gray-200 focus-visible:ring' placeholder='user@example.com'
                        {...register('email')}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                </Field>
            </FieldGroup>
            <Button className='w-full bg-transparent rounded-none border border-blue-600 hover:bg-blue-600 hover:text-white duration-300 text-gray-800 mt-9 mb-10 gap-2.5' disabled={isLoading}>
                {isLoading ?
                    (<Spinner className='w-5 h-5 text-blue-600' />) :
                    (<>Next <ChevronRight size={16} /></>)
                }
            </Button>
            <p className='text-sm font-medium text-gray-500 text-center'>Already have an account? <Link href={'/login'} className='text-blue-600 hover:underline'>Login</Link></p>
        </form>
    )
}
