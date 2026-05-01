import { Button } from "@/shared/components/ui/button"
import { DialogFooter } from "@/shared/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Spinner } from "@/shared/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'

type NewEmail = z.infer<typeof schema>

const schema = z.object({
    newEmail: z.email({ error: "Please enter a valid email" })
})

interface NewEmailProps {
    onSubmit: (newEmail: string) => void;
    isSubmitting?: boolean;
}

export default function VerifyNewEmail({ onSubmit, isSubmitting }: NewEmailProps) {
    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<NewEmail>({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        setTimeout(() => {
            setFocus('newEmail')
        }, 100);
    }, [setFocus])


    async function verifyNewEmail(email: NewEmail) {
        await onSubmit(email.newEmail)
    }

    return (
        <form>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input id='email' {...register('newEmail')} aria-invalid={!!errors.newEmail}
                        className='rounded-none border-gray-200 focus-visible:ring' placeholder='user@example.com'
                    />
                    {errors.newEmail && <p className='text-red-500 text-sm'>{errors.newEmail.message}</p>}
                </Field>
            </FieldGroup>
            <DialogFooter>
                <Button onClick={handleSubmit(verifyNewEmail)}
                    className='w-full py-5 mt-12 rounded-none bg-blue-600 hover:bg-transparent border hover:border-blue-600 hover:text-blue-600 duration-300 gap-2.5' disabled={isSubmitting}>
                    {isSubmitting ?
                        (<Spinner className='w-5 h-5 text-blue-600' />) :
                        (<>Next <ChevronRight size={16} /></>)
                    }
                </Button>
            </DialogFooter>
        </form>
    )
}
