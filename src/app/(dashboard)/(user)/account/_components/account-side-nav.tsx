'use client'
import { Button } from '@/shared/components/ui/button'
import { Lock, LogOut, UserCircle2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AccountSideNav() {
    const path = usePathname()
    
    return (
        <>
            <div className='flex flex-col min-h-full justify-between border-gray-700 bg-blue-50 p-2'>
                <div className='space-y-2.5 grow'>
                    <Link href="/account" className={`${path == '/account' && 'text-blue-600 bg-blue-50'} flex gap-2.5 items-center py-2.5 px-4`}>
                        <UserCircle2 /> Profile
                    </Link>
                    <Link href="/account/change-password" className={`${path === '/account/change-password' && 'text-blue-600 bg-blue-50'} flex gap-2.5 items-center py-2.5 px-4`}>
                        <Lock /> Change Password
                    </Link>
                </div>
                <div className='flex-row items-center gap-2.5 **:text-destructive justify-self-end'>
                    <Button variant={'secondary'} onClick={() => signOut({ callbackUrl: '/login' })} className='w-full justify-start'>
                        <LogOut className='rotate-180' /> Logout
                    </Button>
                </div>

            </div >
        </>
    )
}
