"use client"
import { Button } from '@/shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { ChangePass } from '@/shared/lib/api/account/account.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'


const schema = z.object({
  currentPassword: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character"),
  newPassword: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string().min(8, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type PasswordInfo = z.infer<typeof schema>

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, setFocus, formState: { errors } } = useForm<PasswordInfo>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    setTimeout(() => {
      setFocus('currentPassword')
    }, 1000);
  }, [setFocus])


  const { mutate: changePass, isPending } = useMutation({
    mutationFn: async (data: PasswordInfo) => {

      const res = await ChangePass(data)
      return res
    },
    onSuccess: (res) => {
      toast.success(res?.message)
      signOut({ callbackUrl: '/' })
    },
    onError: (error) => {
      toast.error((error as Error).message)
    }
  })

  return (
    <form className='text-gray-800 space-y-4'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='currentPassword'>Current Password</FieldLabel>
          <div className="relative">
            <Input id='currentPassword' className='rounded-none border-gray-200 focus-visible:ring' type={showPassword ? "text" : "password"} placeholder='********' {...register('currentPassword')} aria-invalid={!!errors.currentPassword} />
            {!showPassword ? (
              <EyeOff className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
            ) : (
              <Eye className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
            )}
          </div>
          {errors.currentPassword && <p className='text-red-500 text-sm'>{errors.currentPassword.message}</p>}
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
          <div className="relative">
            <Input id='newPassword' className='rounded-none border-gray-200 focus-visible:ring' type={showPassword ? "text" : "password"} placeholder='********' {...register('newPassword')} aria-invalid={!!errors.newPassword} />
            {!showPassword ? (
              <EyeOff className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
            ) : (
              <Eye className='text-gray-400 absolute right-0 top-1/2 -translate-1/2 cursor-pointer' size={18} onClick={() => setShowPassword((prev) => !prev)} />
            )}
          </div>
          {errors.newPassword && <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>}
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='confirmPassword'>Confirm New Password</FieldLabel>
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
      <Button onClick={handleSubmit((data) => changePass(data))}
      className='w-full h-11.5 rounded-none bg-blue-600 hover:bg-transparent hover:text-gray-800 text-white font-medium text-sm border-2 hover:border-blue-600 duration-300 py-3.5 mb-9 mt-10' disabled={isPending}>
        {isPending ?
          <Spinner className='w-5 h-5 text-white' /> :
          'Update Password'
        }
      </Button>
    </form>
  )
}