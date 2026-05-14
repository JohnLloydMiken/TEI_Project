import { prisma } from "@/lib/prisma";
import ManageUsersClient, { CSDUser } from "@/components/dashboard/admin/manage-users/manage-users-client";

async function getCSDUsers(): Promise<CSDUser[]> {
  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      logs: {
        where: { action: "TAGGED" },
        select: { id: true },
      },
    },
  });

  // Cast to any first to escape the broken inference, then map to your typed shape
  return (users as any[]).map((u) => ({
    id: u.id as number,
    name: u.name as string,
    email: u.email as string,
    createdAt: (u.createdAt as Date).toISOString(),
    taggedCount: (u.logs as { id: number }[]).length,
  }));
}

export default async function ManageUsersPage() {
  const users = await getCSDUsers();
  return <ManageUsersClient initialUsers={users} />;
}