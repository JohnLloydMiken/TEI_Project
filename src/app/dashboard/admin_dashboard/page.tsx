// app/dashboard/admin_dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Double-check: middleware should catch this first, but just in case
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard/user_dashboard");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  );
}