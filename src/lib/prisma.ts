// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMssql } from '@prisma/adapter-mssql'

// sqlserver://SYSTEM-OJT:1433;database=BillDeposit;user=ojt;password=TEI1949!;trustServerCertificate=true;encrypt=false
function parseSqlServerUrl(url: string) {
  const withoutProtocol = url.replace('sqlserver://', '');
  const parts = withoutProtocol.split(';');
  
  // first part is always server:port
  const [server, port] = parts[0].split(':');
  
  // rest are key=value pairs
  const params: Record<string, string> = {};
  for (const part of parts.slice(1)) {
    const eqIndex = part.indexOf('=');
    if (eqIndex === -1) continue;
    const key = part.substring(0, eqIndex).trim();
    const value = part.substring(eqIndex + 1).trim();
    params[key] = value;
  }

  console.log("DB connecting to:", server, "| database:", params['database']); // ← temp debug

  return {
    server,
    port: Number(port) || 1433,
    database: params['database'],
    user: params['user'],
    password: params['password'],
    options: {
      encrypt: params['encrypt'] !== 'false',
      trustServerCertificate: params['trustServerCertificate'] === 'true',
    },
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaMssql(parseSqlServerUrl(process.env.DATABASE_URL!)),
     log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma