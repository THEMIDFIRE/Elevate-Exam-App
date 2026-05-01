import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { PhoneInput } from '../../../../shared/components/phone-input'

const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z.string().optional(),
})

type PersonalInfo = z.infer<typeof schema>

interface PersonalInfoProps {
    onSubmit: (data: PersonalInfo) => void
}

export default function PersonalInfoStep({ onSubmit }: PersonalInfoProps) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PersonalInfo>({
        resolver: zodResolver(schema)
    })

    function handleFormSubmit(data: PersonalInfo) {
        onSubmit(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
                <div className="flex gap-2.5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='firstName' className='gap-0'>
                                First Name<span className='text-red-600'>*</span>
                            </FieldLabel>
                            <Input id='firstName' className='rounded-none border-gray-200 focus-visible:ring' placeholder='Ahmed' {...register('firstName')} aria-invalid={!!errors.firstName} />
                            {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
                        </Field>
                    </FieldGroup>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='lastName' className='gap-0'>
                                Last Name<span className='text-red-600'>*</span>
                            </FieldLabel>
                            <Input id='lastName' className='rounded-none border-gray-200 focus-visible:ring' placeholder='Abdullah' {...register('lastName')} aria-invalid={!!errors.lastName} />
                            {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName.message}</p>}
                        </Field>
                    </FieldGroup>
                </div>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor='username' className='gap-0'>
                            Username<span className='text-red-600'>*</span>
                        </FieldLabel>
                        <Input id='username' className='rounded-none border-gray-200 focus-visible:ring' placeholder='user123' {...register('username')} aria-invalid={!!errors.username} />
                        {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
                    </Field>
                </FieldGroup>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor='phone'>Phone Number</FieldLabel>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    id='phone'
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.phone && <p className='text-red-500 text-sm'>{errors.phone.message}</p>}
                    </Field>
                </FieldGroup>
                <Button className='w-full bg-transparent rounded-none border border-blue-600 hover:bg-blue-600 hover:text-white duration-300 text-gray-800 mt-9 mb-10 gap-2.5' disabled={isSubmitting}>
                    Next <ChevronRight size={16} />
                </Button>
            </form>
        </>
    )
}
