
import { ExamSessionProvider } from "@/shared/providers/exam-session-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {

    return (
        <>
            <div className="container px-3 h-fit">
                <ExamSessionProvider>
                    {children}
                </ExamSessionProvider>
            </div>
        </>
    );
}