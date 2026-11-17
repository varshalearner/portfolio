import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import { getStorageInfo } from "@/lib/admin/storage";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) redirect("/admin/login");
  const storage = getStorageInfo();
  return <AdminShell storage={storage}>{children}</AdminShell>;
}
