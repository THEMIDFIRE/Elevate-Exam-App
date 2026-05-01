import { getServerSession } from "next-auth";
import AdminAuditlogComponent from "./_components/audit-log";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
    const session = await getServerSession(authOptions)
    const role = session?.user.role ?? "USER"
    return (
        <AdminAuditlogComponent role={role} />
    )
}
