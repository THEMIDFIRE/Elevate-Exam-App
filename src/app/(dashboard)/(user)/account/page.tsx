
'use client'

import { PhoneInput } from "@/shared/components/phone-input"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogTrigger } from "@/shared/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { ChangeInfo } from "@/shared/lib/api/account/account.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { PencilLine } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from 'zod'
import ChangeEmail from "./_components/change-email"
import DeleteAccount from "./_components/delete-account"

const formatPhoneToE164 = (phone: string | null | undefined): string => {
    if (!phone) return '';

    const trimmed = phone.trim();
    if (!trimmed) return '';

    // Already E.164 format
    if (trimmed.startsWith('+20')) return trimmed;

    // Egyptian local format: starts with 0, strip and add +20
    if (trimmed.startsWith('0') && trimmed.length === 11) {
        return '+20' + trimmed.slice(1);
    }

    // Fallback: assume it's E.164 or return as-is
    return trimmed;
};

const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    profilePhoto: z.string().optional().nullable(),
    phone: z.string().optional().nullable()
})

type AccountInfo = z.infer<typeof schema>

export default function AccountSettings() {
    const { data: session, update } = useSession()

    const userFirstName = session?.user.firstName
    const userLastName = session?.user.lastName
    const userUsername = session?.user.username
    const userEmail = session?.user.email
    const userPhone = session?.user.phone

    const { register, handleSubmit, control, formState: { errors } } = useForm<AccountInfo>({
        resolver: zodResolver(schema)
        , values: {
            firstName: userFirstName ?? '',
            lastName: userLastName ?? '',
            phone: formatPhoneToE164(userPhone),
        }
    })



    const { mutate: updateInfo, isPending } = useMutation({
        mutationFn: async (data: AccountInfo) => {
            const res = await ChangeInfo({ ...data, phone: data?.phone?.slice(2,) })
            return res
        },
        onError: (err) => {
            let errorMsg = 'Failed to update account info';
            if (err instanceof Error) {
                errorMsg = err.message;
                if ('errors' in err && Array.isArray(err.errors) && err.errors.length > 0) {
                    errorMsg = err.errors[0].message;
                }
            }
            toast.error(errorMsg);
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Profile succesfully updated')
            update({
                user: {
                    ...session?.user,
                    firstName: res.payload.user.firstName,
                    lastName: res.payload.user.lastName,
                    phone: res?.payload.user?.phone
                }
            })
            setTimeout(() => {
                signOut({ callbackUrl: '/' })
            }, 2000);
        }
    })

    return (
        <>
            <form className='space-y-4 *:text-gray-800'>
                <div className="flex gap-2.5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='firstName' className='gap-0'>
                                First Name
                            </FieldLabel>
                            <Input id='firstName' className='rounded-none border-gray-200 focus-visible:ring' placeholder='Ahmed'
                                {...register('firstName')} aria-invalid={!!errors.firstName}
                            />
                            {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
                        </Field>
                    </FieldGroup>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='lastName' className='gap-0'>
                                Last Name
                            </FieldLabel>
                            <Input id='lastName' className='rounded-none border-gray-200 focus-visible:ring' placeholder='Abdullah'
                                {...register('lastName')} aria-invalid={!!errors.lastName}
                            />
                            {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName.message}</p>}
                        </Field>
                    </FieldGroup>
                </div>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor='username' className='gap-0'>
                            Username
                        </FieldLabel>
                        <Input id='username' className='rounded-none border-gray-200 focus-visible:ring' placeholder='user123' disabled
                            value={`${userUsername ?? 'Loading...'}`}
                        />
                    </Field>
                </FieldGroup>
                <FieldGroup>
                    <Field>
                        <div className="flex justify-between">
                            <FieldLabel htmlFor='email'>Email</FieldLabel>
                            <Dialog>
                                <DialogTrigger className="flex gap-1.5 text-blue-600 font-medium text-sm hover:underline">
                                    <PencilLine size={16} /> Change
                                </DialogTrigger>
                                <ChangeEmail />
                            </Dialog>
                        </div>
                        <Input id='email' readOnly
                            className='rounded-none border-gray-200 focus-visible:ring' placeholder='user@example.com'
                            value={`${userEmail ?? 'Loading...'}`}
                        />
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
                                    defaultCountry='EG'
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    international={false}
                                />
                            )}
                        />
                        {errors.phone && <p className='text-red-500 text-sm'>{errors.phone.message}</p>}
                    </Field>
                </FieldGroup>
                <div className="flex gap-3.5 justify-between h-fit">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"destructive"}
                            className='flex-1 bg-transparent text-red-600 rounded-none hover:text-white hover:bg-red-600 duration-300 gap-2.5'>
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DeleteAccount />
                    </Dialog>
                    <Button type="submit" onClick={handleSubmit((data) => updateInfo(data))} disabled={isPending}
                        className='flex-1 bg-blue-600 rounded-none  hover:bg-blue-400 duration-300 gap-2.5'>
                        Save Changes
                    </Button>
                </div>
            </form>
        </>
    )
}
