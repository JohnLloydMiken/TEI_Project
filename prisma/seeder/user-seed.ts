import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
export async function seedUsers(prisma: PrismaClient) {
  // Users
    const  adminPassword = await bcrypt.hash('admin123', 10);
    const csdPassword = await bcrypt.hash('csd123', 10);

    const admin = await prisma.user.upsert({
    where: { email: 'admin@tei.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@tei.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const csd1 = await prisma.user.upsert({
    where: { email: 'csd1@tei.com' },
    update: {},
    create: {
      name: 'Juan dela Cruz',
      email: 'csd1@tei.com',
      password: csdPassword,
      role: 'CSD',
    },
  })

  const csd2 = await prisma.user.upsert({
    where: { email: 'csd2@tei.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'csd2@tei.com',
      password: csdPassword,
      role: 'CSD',
    },
  })

   const csd3 = await prisma.user.upsert({
    where: { email: 'csd3@tei.com' },
    update: {},
    create: {
      name: 'John Lloyd Miken',
      email: 'csd3@tei.com',
      password: "miken123",
      role: 'CSD',
    },
  })

  console.log('✅ Users seeded:', { admin, csd1, csd2, csd3 })

  
}