import { Skeleton } from '@/shared/components/ui/skeleton'
import React from 'react'

export default function TableSkeleten() {
    return (
        <>
            {Array.from({ length: 12 }, (_, i) => (
                <div key={i}>
                    <Skeleton className="h-5 bg-gray-400 rounded-md" />
                    <Skeleton className="h-5 bg-gray-400 rounded-md" />
                    <Skeleton className="h-5 bg-gray-400 rounded-md" />
                    <Skeleton className="h-5 bg-gray-400 rounded-md" />
                </div>
            ))
            }
        </>
    )
}
