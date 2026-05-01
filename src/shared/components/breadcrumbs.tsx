'use client'

import { useParams, usePathname } from "next/navigation"

export default function Breadcrumbs() {
    const path = usePathname()
    const { diploma, exam } = useParams()

    const segments = path.split('/').filter(path => path !== '')
    const formatSegments = decodeURIComponent(`${segments}`)

    const items = formatSegments.split(',').filter(item => item !== '').filter(item => item !== 'dashboard')
    const dashedSegment = items.find(item => item.includes('-'))

    if (path === '/') {
        items.push('diplomas')
    }

    if (diploma && !exam) {
        items.push('exams')
    }

    if (dashedSegment) {
        const formatDashedSegment = items.pop()?.split('-').join(' ')
        items.push(formatDashedSegment as string)
    }

    return (
        <nav>
            <ul className='flex items-center gap-2.5 px-4 pt-4 '>
                {items.map((item, i) => {
                    const isLast = i === items.length - 1
                    return (
                        <li key={i} className={`flex items-center gap-2.5 text-gray-400 ${(path.includes('/dashboard/exams') && path.includes('/questions')) ? `nth-[2]:*:max-w-[19ch] nth-[2]:*:truncate` : ''}`}>
                            <span className={`capitalize ${isLast ? 'font-medium text-blue-600' : ''}`}>
                                {item}
                            </span>
                            {!isLast && <span>/</span>}
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
