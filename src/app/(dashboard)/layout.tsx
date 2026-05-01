import Breadcrumbs from "@/shared/components/breadcrumbs";
import SideBar from "@/shared/components/side-bar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LayoutLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    const role = session?.user.role ?? "USER"

    return (
        <>
            <div className="container grid grid-cols-[25%_1fr] min-w-full">
                <aside>
                    <SideBar role={role} />
                </aside>
                <section>
                    <Breadcrumbs />
                    {children}
                </section>
            </div>
        </>
    );
}