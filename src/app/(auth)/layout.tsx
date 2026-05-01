import React from 'react';
import Info from './_components/Info';

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <div className="container ">
                <div className={`grid grid-cols-2 max-w-4/5 mx-auto relative items-center overflow-hidden`}>
                    <Info />
                    {children}
                    <div className="size-100.5 bg-blue-400/35 rounded-full -z-10 absolute -bottom-26.25 left-3.5 blur-3xl"></div>
                </div>
            </div>
        </main>
    )
}
