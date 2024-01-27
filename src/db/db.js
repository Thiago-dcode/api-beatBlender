import { PrismaClient } from '@prisma/client'

// Create a singleton instance of Prisma Client
let prisma = null

export const db = async () => {
  if (!prisma) {
    prisma = new PrismaClient()
    // Optional: You can add any additional initialization logic here
  }
  return prisma
}
