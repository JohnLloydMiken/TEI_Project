// app/dashboard/user_dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CSD") {
    redirect("/dashboard/admin_dashboard");
  }else{
    redirect("/dashboard/user_dashboard/eligibility-checker")
  }



}