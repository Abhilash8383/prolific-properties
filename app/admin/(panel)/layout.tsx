import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/client";
import { adminAccount, adminCounts } from "@/lib/admin-data";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [account, counts] = await Promise.all([adminAccount(), adminCounts()]);
  return (
    <div className="min-h-dvh bg-surface lg:flex">
      <AdminNav email={account.email} newEnquiries={counts.newEnquiries} logout={logout} />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
