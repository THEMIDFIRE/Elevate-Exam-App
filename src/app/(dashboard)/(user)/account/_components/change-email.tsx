'use client'

import { DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { ConfirmNewEmail, ConfirmOTP } from "@/shared/lib/api/account/account.api"
import { useMutation } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ConfirmEmailOTP from "./confirm-otp"
import VerifyNewEmail from "./new-email"
import ProgressBar from "@/app/(auth)/register/_components/progressBar"

const InterFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

type NewEmail = {
    newEmail: string
}

export default function ChangeEmail() {
    const [newEmail, setNewEmail] = useState<NewEmail>()
    const [otpError, setOTPError] = useState(false)
    const [formStep, setFormStep] = useState(1)
    const [timer, setTimer] = useState(60)

    const { data: session, update } = useSession()

    useEffect(() => {
        if (formStep !== 2) return

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 0) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [formStep])

    // Step 1
    const { mutate: handleNewEmail, isPending: pendingNewEmail } = useMutation({
        mutationFn: async (newEmail: string) => {
            const res = await ConfirmNewEmail(newEmail)
            return res
        },
        onError: (err) => {
            toast.error((err as Error).message)
        },
        onSuccess: (res, variables) => {
            toast.success(res.message)
            setNewEmail({ newEmail: variables })
            setTimer(60)
            setFormStep(2)
        }
    })

    // Step 2
    const { mutate: confirmOTP, isPending: pendingVerifyOTP } = useMutation({
        mutationFn: async (code: string) => {
            const res = await ConfirmOTP(code)
            return res
        },
        onError: (err) => {
            toast.error((err as Error).message || 'Failed to verify OTP')
            setOTPError(true)
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Email succesfully changed')
            update({
                user: {
                    ...session?.user, email: res.payload.user.email
                }
            })
            setTimeout(() => {
                signOut({ callbackUrl: '/' })
            }, 2000);
        }
    })

    const { mutate: resendOTP } = useMutation({
        mutationFn: async (newEmail: string) => {
            const res = await ConfirmNewEmail(newEmail)
            return res
        },
        onError: (err) => {
            toast.error((err as Error).message || 'Failed to send verification email')
        },
        onSuccess: (res) => {
            setTimer(60)
            toast.success(res.message)
        }
    })


    return (
        <DialogContent className="pb-6 p-12 rounded-none">
            <DialogHeader className={`${InterFont.className} font-bold`}>
                <ProgressBar totalSteps={2} currentStep={formStep} />
                <DialogTitle className='text-3xl'>Change Email</DialogTitle>
                {formStep === 1 && <h4 className="text-2xl text-blue-600 my-7.5">Enter your new email</h4>}
                {formStep === 2 && <h4 className="text-2xl text-blue-600 my-7.5">EVerify OTP</h4>}
            </DialogHeader>
            {formStep === 1 && <VerifyNewEmail onSubmit={handleNewEmail} isSubmitting={pendingNewEmail} />}
            {formStep === 2 && <ConfirmEmailOTP otpError={otpError} timer={timer} onResendOTP={() => resendOTP(newEmail?.newEmail ?? "")} onSubmit={confirmOTP} email={newEmail?.newEmail} edit={() => setFormStep(1)} isLoading={pendingVerifyOTP} />}
        </DialogContent>
    )
}
