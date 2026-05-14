import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaMssql } from '@prisma/adapter-mssql'
import bcrypt from 'bcryptjs'
import { seedUsers } from './seeder/user-seed'
import 'dotenv/config'  // load .env before anything else
const sqlConfig = {
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

const adapter = new PrismaMssql(sqlConfig)
const prisma = new PrismaClient({ adapter })

async function main() {

  // ─── USERS ───────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  const csdPassword = await bcrypt.hash('csd123', 10)

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
      email: 'csd2@tei.com',
      password: "miken123",
      role: 'CSD',
    },
  })

  console.log('✅ Users seeded:', { admin, csd1, csd2, csd3 })
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })