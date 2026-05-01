"use client"
import { ConfirmEmail, Register, VerifyEmail } from '@/shared/lib/api/register/register.api'
import { useMutation } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import PasswordStep from './(steps)/password'
import PersonalInfoStep from './(steps)/personal-info'
import VerifyEmailStep from './(steps)/verify-email'
import OTPStep from './(steps)/verify-otp'
import ProgressBar from './_components/progressBar'


const InterFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

type RegisterData = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  phone?: string | null
}

export default function RegisterPage() {
  const [registerationData, setRegisterationData] = useState<Partial<RegisterData>>({})
  const [formStep, setFormStep] = useState(1)
  const [timer, setTimer] = useState(60)

  const router = useRouter()

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
  const { mutate: verifyEmail, isPending: pendingVerifyEmail } = useMutation({
    mutationFn: async (email: string) => {
      const res = await VerifyEmail(email)
      return res
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to send verification email')
    },
    onSuccess: (res, email) => {
      setRegisterationData({ ...registerationData, email })
      setTimer(60)
      setFormStep(2);
      toast.success(res.message)
    }
  })

  // Step 2
  const { mutate: verifyOTP, isPending: pendingVerifyOTP } = useMutation({
    mutationFn: async (code: string) => {
      const res = await ConfirmEmail(registerationData.email ?? "", code)
      return res
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to verify OTP')
    },
    onSuccess: (res) => {
      toast.success(res.message)
      setFormStep(3)
    }
  })

  const { mutate: resendOTP } = useMutation({
    mutationFn: async (email: string) => {
      const res = await VerifyEmail(email)
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

  // Step 3
  async function handlePersonalInfo(data: { firstName: string; lastName: string; username: string; phone?: string | null }) {
    setRegisterationData({ ...registerationData, ...data })
    setFormStep(4)
  }

  // Step 4
  const { mutate: passwordSubmit, isPending: pendingCompleteData } = useMutation({
    mutationFn: async (passwordData: { password: string; confirmPassword: string }) => {
      const completeData: RegisterData = { ...registerationData, ...passwordData } as RegisterData
      const dataToSend = {
        ...completeData,
        phone: completeData.phone || undefined
      }
      const res = await Register(dataToSend)
      return res
    },
    onError: (error) => {
      toast.error((error as Error).message)
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Account created successfully')
      router.push('/login')
    }
  })

  return (
    <section>
      <div className="container flex flex-col justify-center max-w-3/4 mx-auto pt-50">
        <div className={`${InterFont.className} font-bold`}>
          {formStep !== 1 && <ProgressBar currentStep={formStep} totalSteps={4} />}
          <h2 className={`text-gray-800 text-3xl mt-2.5`}>Create Account</h2>
          <div className='text-2xl text-blue-600 my-4'>
            {formStep === 2 && <h3>Verify OTP</h3>}
            {formStep === 3 && <h3>Tell us more about you</h3>}
            {formStep === 4 && <h3>Create a strong password</h3>}
          </div>
        </div>
        {formStep === 1 && <VerifyEmailStep onSubmit={verifyEmail} isLoading={pendingVerifyEmail} />}
        {formStep === 2 && <OTPStep timer={timer} onResendOTP={() => resendOTP(registerationData.email ?? "")} onSubmit={verifyOTP} email={registerationData.email} edit={() => setFormStep(1)} isLoading={pendingVerifyOTP} />}
        {formStep === 3 && <PersonalInfoStep onSubmit={handlePersonalInfo} />}
        {formStep === 4 && <PasswordStep onSubmit={passwordSubmit} isLoading={pendingCompleteData} />}
      </div>
    </section>
  )
}