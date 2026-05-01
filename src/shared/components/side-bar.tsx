'use client'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { getUserProfile } from '../lib/api/user/user.api'
import AdminSideNav from '@/app/(dashboard)/(admin)/_components/shared/admin-side-nav'
import UserSideNav from '@/app/(dashboard)/(user)/_components/user-side-nav'


export default function SideBar({ role }: { role: string }) {
    const pathname = usePathname()

    const { data, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await getUserProfile()
            return res
        }
    })

    const user = data

    return (
        <>
            {role === 'ADMIN' && pathname.startsWith('/dashboard') ?
                <AdminSideNav user={user} isLoading={isLoading} />
                :
                <UserSideNav user={user} isLoading={isLoading} />
            }
        </>
    )
}
