import React from 'react'
import AUditlogInfo from '../_components/audit-log-info'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function page() {
    const session = await getServerSession(authOptions)
    const role = session?.user.role ?? "USER"
    return (
        <AUditlogInfo role={role} />
    )
}
