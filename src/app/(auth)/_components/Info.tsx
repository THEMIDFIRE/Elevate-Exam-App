import FolderCodeSVG from "@/_assets/icons/FolderCode";
import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react";
import { Inter } from "next/font/google";

const InterFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function Info() {
    return (
        <section className="relative overflow-hidden">
            <div className="size-100.5 bg-blue-400/35 rounded-full -z-10 absolute top-0 -right-20 blur-3xl"></div>
            <div className="container flex flex-col justify-center py-29 space-y-4">
                <div className="flex gap-2 items-center">
                    <FolderCodeSVG className="size-10" />
                    <h1 className="capitalize font-semibold text-xl text-blue-600">exam app</h1>
                </div>
                <h2 className={`${InterFont.className} font-bold text-3xl mt-34 mb-15`}>Empower your learning journey with our smart exam platform.</h2>
                <div className="space-y-9">
                    <div className="flex items-start gap-x-5 text-blue-600">
                        <div className="border-[1.5px] border-blue-600 p-2">
                            <Brain size={24} />
                        </div>
                        <div className="space-y-2.5">
                            <h3 className="text-xl font-semibold">Tailored Diplomas</h3>
                            <p className="text-black">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-x-5 text-blue-600">
                        <div className="border-[1.5px] border-blue-600 p-2">
                            <BookOpenCheck size={24} />
                        </div>
                        <div className="space-y-2.5">
                            <h3 className="text-xl font-semibold">Focused Exams</h3>
                            <p className="text-black">Access topic-specific tests including HTML, CSS, JavaScript, and more.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-x-5 text-blue-600">
                        <div className="border-[1.5px] border-blue-600 p-2">
                            <RectangleEllipsis size={24} />
                        </div>
                        <div className="space-y-2.5">
                            <h3 className="text-xl font-semibold">Smart Multi-Step Forms</h3>
                            <p className="text-black">Choose from specialized tracks like Frontend, Backend, and Mobile Development..</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
