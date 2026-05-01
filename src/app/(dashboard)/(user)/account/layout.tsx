import { UserRound } from "lucide-react";
import AccountSideNav from "./_components/account-side-nav";
import GeneralHeader from "@/shared/components/header";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {

    return (
        <>
            <GeneralHeader>
                <UserRound size={40} /> Account Settings
            </GeneralHeader>
            <div className="grid grid-cols-[25%_1fr] gap-6 h-[72dvh] ">
                <aside>
                    <AccountSideNav />
                </aside>
                <section>
                    {children}
                </section>
            </div>
        </>
    );
}