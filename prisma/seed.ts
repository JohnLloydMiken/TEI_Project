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

async function main(){
 
    await seedUsers(prisma);


}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });