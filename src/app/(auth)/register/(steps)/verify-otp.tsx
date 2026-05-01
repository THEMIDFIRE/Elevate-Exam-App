"use client"
import { Button } from "@/shared/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp"
import { Spinner } from "@/shared/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from 'zod'

const schema = z.object({
    code: z.string().length(6, "Code must be 6 digits")
})

type OTPData = z.infer<typeof schema>

interface OTPStepProps {
    onSubmit: (code: string) => void
    email: string | undefined
    edit: () => void
    timer: number
    onResendOTP?: () => void | undefined
    isLoading?: boolean
}

export default function OTPStep({ onSubmit, email, edit, timer, onResendOTP, isLoading }: OTPStepProps) {
    const { handleSubmit, control, setFocus } = useForm<OTPData>({ resolver: zodResolver(schema) })


    useEffect(() => {
        setTimeout(() => {
            setFocus('code')
        }, 100);
    }, [setFocus])

    async function OTPSubmit(data: OTPData) {
        await onSubmit(data.code)
    }

    return (
        <>
            <div className="space-y-2.5 pb-6">
                <p className="text-gray-500">Please enter the 6-digits code we have sent to: <span className="text-gray-800">{email}.</span>
                    <Button variant={"link"} onClick={edit} className="text-blue-600 underline font-medium p-0">Edit</Button>
                </p>
            </div>
            <form onSubmit={handleSubmit(OTPSubmit)} className="w-full flex flex-col items-center">
                <div className="space-y-6">
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                <InputOTPGroup className="gap-4 *:border *:first:rounded-none *:last:rounded-none *:data-[active=true]:ring-blue-600 *:data-[active=true]:ring-0 *:data-[active=true]:border-blue-600 *:data-[active=true]:text-blue-600 *:rounded-none *:font-medium *:text-base *:size-10">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />
                    {timer !== 0 ?
                        <p className="text-gray-500 font-medium text-sm">You can request another code in: {timer}s</p>
                        :
                        <p className="text-gray-500 font-medium text-sm">Didn&apos;t receive the code? <Button variant={"link"} onClick={onResendOTP} className="text-blue-600 p-0">Resend</Button></p>
                    }
                </div>
                <Button className='w-full bg-transparent rounded-none border border-blue-600 hover:bg-blue-600 hover:text-white duration-300 text-gray-800 mt-9 mb-10 gap-2.5' disabled={isLoading}>
                    {isLoading ?
                        <Spinner className='w-5 h-5 text-blue-600' /> :
                        'Verify Code'
                    }
                </Button>
            </form>
        </>
    )
}