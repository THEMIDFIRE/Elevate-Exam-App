import React from 'react'

interface HeaderProps {
    children: React.ReactNode
    className?: string
}

export default function AdminSectionHeader({ children, className }: HeaderProps) {
    return (
        <header className={`bg-blue-600 text-white p-2.5 font-semibold my-6 ${className}`}>
            <h4>{children}</h4>
        </header>
    )
}
