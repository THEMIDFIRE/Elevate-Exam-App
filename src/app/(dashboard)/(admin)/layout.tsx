import { TooltipProvider } from "@/shared/components/ui/tooltip";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {

    return (
        <>
            <div className="container py-4 px-7">
                <TooltipProvider>{children}</TooltipProvider>
            </div>
        </>
    );
}