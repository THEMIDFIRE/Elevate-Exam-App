import { Button } from "@/shared/components/ui/button"
import { MoveLeft } from "lucide-react"
import Link from "next/link"

interface VerifyOTPProps {
    onBack: () => void
    email: string
}

export default function VerifyOTP({ onBack, email }: VerifyOTPProps) {

    return (
        <section>
            <div className="container flex flex-col justify-center max-w-3/4 mx-auto pt-35">
                <Button variant={"secondary"} onClick={onBack} size={"icon"} className="size-10 mb-10 border-[1.5px] border-gray-200 hover:border hover:border-blue-600"><MoveLeft /></Button>
                <h2 className="text-3xl font-bold">Password Reset Sent</h2>
                <p className="text-gray-800 mt-4 mb-10">
                    We have sent a password reset link to: <span className="text-blue-600">{email}</span><br /><br />
                    <span>Please check your inbox and follow the instructions to reset your password.</span><br /><br />
                    <span className="text-gray-500">If you don&apos;t see the email within a few minutes, check your spam or junk folder.</span>
                </p>
                <p className='text-sm font-medium text-gray-500 text-center'>Don&apos;t have an account? <Link href={'/register'} className='text-blue-600 hover:underline'>Create yours</Link></p>
            </div>
        </section>
    )
}