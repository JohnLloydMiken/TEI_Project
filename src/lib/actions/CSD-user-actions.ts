"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ── Create User ────────────────────────────────────────────────────────────────
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: "Email already in use." };

  const hashed = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: "CSD",
    },
  });

  revalidatePath("/admin/manage-users");
  return { success: true };
}

// ── Update User Details (name + email only) ────────────────────────────────────
export async function updateUserDetails(data: {
  id: number;
  name: string;
  email: string;
}) {
  const emailTaken = await prisma.user.findFirst({
    where: { email: data.email, NOT: { id: data.id } },
  });
  if (emailTaken) return { error: "Email already in use by another user." };

  await prisma.user.update({
    where: { id: data.id },
    data: { name: data.name, email: data.email },
  });

  revalidatePath("/admin/manage-users");
  return { success: true };
}

// ── Update Password ────────────────────────────────────────────────────────────
export async function updateUserPassword(data: {
  id: number;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await prisma.user.findUnique({ where: { id: data.id } });
  if (!user) return { error: "User not found." };

  const match = await bcrypt.compare(data.currentPassword, user.password);
  if (!match) return { error: "Current password is incorrect." };

  const hashed = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: data.id },
    data: { password: hashed },
  });

  revalidatePath("/admin/manage-users");
  return { success: true };
}

// ── Delete User ────────────────────────────────────────────────────────────────
export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/manage-users");
  return { success: true };
}