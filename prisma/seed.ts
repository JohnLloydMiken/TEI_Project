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

  console.log('✅ Users seeded:', { admin, csd1, csd2 })

  // ─── UPLOAD BATCH ─────────────────────────────────────
  const batch = await prisma.uploadBatch.create({
    data: {
      fileName: 'april_2025_qualified_customers.xlsx',
      uploadedBy: admin.id,
      month: 4,   // April
      year: 2025,
    },
  })

  console.log('✅ Upload batch seeded:', batch)

  // ─── CUSTOMERS ────────────────────────────────────────
  const customers = await prisma.customer.createMany({
    
    data: [
      {
        accountNo: 'TEI-00001',
        customerName: 'Pedro Reyes',
        address: 'Blk 1 Lot 2, Mandaluyong City',
        email: 'pedro.reyes@email.com',
        phone: '09171234567',
        depositAmount: 1500.00,
        notificationDate: new Date('2025-04-01'), // deadline is May 1
        batchId: batch.id,
      },
      {
        accountNo: 'TEI-00002',
        customerName: 'Ana Villanueva',
        address: 'Blk 3 Lot 5, Pasig City',
        email: 'ana.villanueva@email.com',
        phone: '09189876543',
        depositAmount: 2000.00,
        notificationDate: new Date('2025-04-01'),
        batchId: batch.id,
      },
      {
        accountNo: 'TEI-00003',
        customerName: 'Carlos Mendoza',
        address: 'Blk 7 Lot 1, Quezon City',
        email: null,
        phone: '09204567890',
        depositAmount: 1200.00,
        notificationDate: new Date('2025-04-01'),
        batchId: batch.id,
      },
      {
        accountNo: 'TEI-00004',
        customerName: 'Liza Fernandez',
        address: 'Blk 2 Lot 8, Makati City',
        email: 'liza.f@email.com',
        phone: null,
        depositAmount: 3000.00,
        notificationDate: new Date('2025-04-01'),
        claimedAt: new Date('2025-04-15'),  // already claimed
        claimedBy: csd1.id,
        batchId: batch.id,
      },
      {
        accountNo: 'TEI-00005',
        customerName: 'Roberto Aquino',
        address: 'Blk 5 Lot 3, San Juan City',
        email: 'roberto.a@email.com',
        phone: '09351122334',
        depositAmount: 1800.00,
        notificationDate: new Date('2025-04-01'),
        batchId: batch.id,
      },
    ],
    
  })

  console.log('✅ Customers seeded:', customers)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })