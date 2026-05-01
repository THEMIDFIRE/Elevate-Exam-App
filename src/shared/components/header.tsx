'use client'
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function GeneralHeader({ children, }: { children: React.ReactNode; }) {
  const path = usePathname()
  const router = useRouter()

  return (
    <header className=' sticky top-0 z-20 bg-white h-fit'>
      <div className="container py-5 flex gap-2.5">
        {path !== '/' &&
          <Button variant={"ghost"} onClick={() => router.back()}
            className="text-blue-600 h-auto border border-blue-600 rounded-none has-[>svg]:px-1.75">
            <ChevronLeft className='size-6' />
          </Button>}
        <h2 className='grow h-fit bg-blue-600 text-white text-2xl font-semibold flex items-center gap-2.5 p-4'>{children}</h2>
      </div>
    </header>
  )
}
