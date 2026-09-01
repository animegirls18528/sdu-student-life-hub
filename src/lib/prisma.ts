import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Handle Netlify / AWS Lambda Serverless environment (read-only filesystem)
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || (process.env.NODE_ENV === 'production' && process.platform === 'linux')) {
    try {
      const tmpDbPath = '/tmp/dev.db';
      const sourceDbPaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];

      if (!fs.existsSync(tmpDbPath)) {
        for (const src of sourceDbPaths) {
          if (fs.existsSync(src)) {
            try {
              fs.copyFileSync(src, tmpDbPath);
              break;
            } catch (e) {
              console.error('Failed to copy db from', src, e);
            }
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return new PrismaClient({
          datasources: {
            db: {
              url: `file:${tmpDbPath}`,
            },
          },
        });
      }
    } catch (err) {
      console.error('Error configuring serverless SQLite:', err);
    }
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

