'use client'
import FolderCodeSVG from '@/_assets/icons/FolderCode'
import { Button } from '@/shared/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { UserInfo } from '@/shared/lib/types/user'
import { BookOpenCheck, EllipsisVertical, GraduationCap, LayoutGrid, LogOut, Logs, UserRound } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSideNav({ user, isLoading }: { user?: UserInfo, isLoading: boolean }) {
    const path = usePathname()
    const router = useRouter()

    return (
        <>
            <div className='container fixed top-0 bottom-0 left-0 flex flex-col h-screen max-w-1/4 *:text-white border-gray-700 bg-gray-800 p-5'>
                <div className='mb-15 aspect-19/6 h-fit'>
                    <div className='relative object-fill w-[80%] h-1/2'>
                        <Image src="/logo.png" alt="Logo" fill className='invert mix-blend-lighten' />
                    </div>
                    <div className="flex gap-2 items-center">
                        <FolderCodeSVG className="size-10 fill-gray-800" />
                        <h1 className="capitalize font-semibold text-xl text-white">exam app</h1>
                    </div>
                </div>
                <div className='grow'>
                    <nav>
                        <ul className="">
                            <li className="mb-4">
                                <Link href="/dashboard/diplomas" className={`${path.includes('/diplomas') && 'border border-gray-400 bg-gray-700'} flex gap-2.5 items-center p-4`}>
                                    <GraduationCap /> Diplomas
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/dashboard/exams" className={`${path.includes('/exams') && 'border border-gray-400 bg-gray-700'} flex gap-2.5 items-center p-4`}>
                                    <BookOpenCheck /> Exams
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/account" className={`${path.includes('/account') && 'border border-blue-500 bg-blue-100'} flex gap-2.5 items-center p-4`}>
                                    <UserRound /> Account Settings
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/dashboard/audit-log" className={`${path.includes('/audit-log') && 'border border-gray-400 bg-gray-700'} flex gap-2.5 items-center p-4`}>
                                    <Logs /> Audit Log
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className='flex items-center justify-between gap-2.5'>
                    {isLoading ?
                        <>
                            <div className='border-2 border-gray-400'>
                                <div className='size-13.5 relative'>
                                    <Skeleton className='size-full rounded-none bg-gray-400' />
                                </div>
                            </div>
                            <div className='max-w-2/3 w-full space-y-4'>
                                <Skeleton className='rounded-md w-20 h-4 bg-gray-400'/>
                                <Skeleton className='rounded-md w-45 h-4 bg-gray-400'/>
                            </div>
                        </>
                        :
                        <>
                            <div className='border-2 border-gray-400'>
                                <div className='size-13.5 relative'>
                                    {user?.profilePhoto ?
                                        <Image src={user.profilePhoto}
                                            fill
                                            alt='User Avatar'
                                            className='aspect-square object-cover object-center border-2 border-blue-600' /> :
                                        <UserRound className='min-w-full h-full text-white' />
                                    }
                                </div>
                            </div>
                            <div className='max-w-2/3 w-full'>
                                <h4 className='text-white font-medium'>
                                    {user?.firstName}
                                </h4>
                                <p className='text-sm text-gray-400 truncate'>{user?.email}</p>
                            </div>
                        </>
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className='text-white' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='right' className='w-42 space-y-1'>
                            <DropdownMenuItem asChild>
                                <Button variant={'secondary'} onClick={() => router.push('/account')} className='w-full justify-start'>
                                    <UserRound className='text-gray-400' /> Account
                                </Button>
                            </DropdownMenuItem>
                            {user?.role === 'ADMIN' &&
                                <DropdownMenuItem asChild>
                                    <Button variant={'secondary'} onClick={() => router.push('/')} className='w-full justify-start'>
                                        <LayoutGrid className='text-gray-400' /> Application
                                    </Button>
                                </DropdownMenuItem>}
                            <DropdownMenuItem variant='destructive' asChild>
                                <Button variant={'secondary'} onClick={() => signOut({ callbackUrl: '/login' })} className='w-full justify-start'>
                                    <LogOut className='rotate-180' /> Logout
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    )
}
