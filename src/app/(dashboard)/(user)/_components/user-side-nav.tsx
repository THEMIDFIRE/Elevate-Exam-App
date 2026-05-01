'use client'
import FolderCodeSVG from '@/_assets/icons/FolderCode'
import { Button } from '@/shared/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { UserInfo } from '@/shared/lib/types/user'
import { Bolt, EllipsisVertical, GraduationCap, LogOut, UserRound } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function UserSideNav({ user, isLoading }: { user?: UserInfo, isLoading: boolean }) {
    const path = usePathname()
    const router = useRouter()

    return (
        <>
            <div className='container fixed top-0 bottom-0 left-0 flex flex-col h-screen max-w-1/4 bg-blue-50 p-5'>
                <div className='mb-15 aspect-19/6 h-fit'>
                    <div className='relative object-fill w-[80%] h-1/2'>
                        <Image src="/logo.png" alt="Logo" fill />
                    </div>
                    <div className="flex gap-2 items-center">
                        <FolderCodeSVG className="size-10" />
                        <h1 className="capitalize font-semibold text-xl text-blue-600">exam app</h1>
                    </div>
                </div>
                <div className='grow'>
                    <nav>
                        <ul className="**:text-blue-600">
                            <li className="mb-4">
                                <Link href="/" className={`${(path === '/' || path.includes('/diploma')) && 'border border-blue-500 bg-blue-100'} flex gap-2.5 items-center p-4`}>
                                    <GraduationCap /> Diplomas
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/account" className={`${path.includes('/account') && 'border border-blue-500 bg-blue-100'} flex gap-2.5 items-center p-4`}>
                                    <UserRound /> Account Settings
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
                                <Skeleton className='rounded-md w-20 h-4 bg-gray-400' />
                                <Skeleton className='rounded-md w-45 h-4 bg-gray-400' />
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
                                <h4 className='text-gray-600 font-medium'>
                                    {user?.firstName}
                                </h4>
                                <p className='text-sm text-gray-400 truncate'>{user?.email}</p>
                            </div>
                        </>
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className='text-gray-400' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='right' className='w-42 space-y-1'>
                            <DropdownMenuItem asChild>
                                <Button variant={'secondary'} onClick={() => router.push('/account')} className='w-full justify-start'>
                                    <UserRound className='text-gray-400' /> Account
                                </Button>
                            </DropdownMenuItem>
                            {user?.role === 'ADMIN' &&
                                <DropdownMenuItem asChild>
                                    <Button variant={'secondary'} onClick={() => router.push('/dashboard/diplomas')} className='w-full justify-start'>
                                        <Bolt className='text-gray-400' /> Dashboard
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
