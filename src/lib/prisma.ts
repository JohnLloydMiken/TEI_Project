import { PrismaClient } from '../generated/prisma/client'
import { PrismaMssql } from '@prisma/adapter-mssql'
import 'dotenv/config'
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
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

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaMssql(sqlConfig)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma