'use client'
import { Card, CardDescription, CardTitle } from '@/shared/components/ui/card'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChevronDown, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import GeneralHeader from '@/shared/components/header'
import { getDiplomas } from '@/shared/lib/api/diplomas/allDiplomas.api'

export default function Diplomas() {
    const limit = 6
    const { inView, ref, entry } = useInView({ delay: 300, trackVisibility: true })
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['diplomas'],
        queryFn: ({ pageParam }) => getDiplomas(limit, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.payload.metadata.page === lastPage.payload?.metadata.totalPages) return undefined
            return lastPage.payload.metadata.page + 1
        }
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && entry) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, entry])


    return (
        <>
            <GeneralHeader>
                <GraduationCap size={40} />Diplomas
            </GeneralHeader>
            <div className="px-2 mb-6 lg:grid grid-cols-3 gap-2.5">
                {data?.pages.flatMap(page => page.payload.data.map((diploma) => (
                    <Link href={`/diplomas/${diploma.title}?diplomaId=${diploma.id}`} key={diploma.id}>
                        <Card className='py-0 rounded-none group/diploma'>
                            <div className='relative w-full h-80 overflow-hidden'>
                                {diploma.image && <Image src={diploma.image} fill alt={diploma.title} className='group-hover/diploma:scale-110 transition duration-200 object-cover' />}
                                <div className='bg-blue-600/75 *:text-white p-4 space-y-1 backdrop-blur-md absolute bottom-2.5 inset-x-2.5'>
                                    <CardTitle className='text-md font-semibold'>{diploma.title}</CardTitle>
                                    <CardDescription className='text-sm font-normal h-10 overflow-hidden group-hover/diploma:h-30 transition-all duration-200'>{diploma.description}</CardDescription>
                                </div>
                            </div>
                        </Card>
                    </Link>
                )))}
                {!isLoading &&
                    <div className="*:w-full *:text-gray-600 *:text-center col-span-3 my-8.5">
                        <p ref={ref}>{hasNextPage ? 'Scroll to view more' : 'End of list'}</p>
                        {hasNextPage && <ChevronDown />}
                    </div>
                }
            </div>
        </>
    )
}