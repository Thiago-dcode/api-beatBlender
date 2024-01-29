import { PrismaClient } from "@prisma/client";

// Create a singleton instance of Prisma Client
let prisma: PrismaClient | null = null;

export const db = () => {
  if (!prisma) {
    prisma = new PrismaClient();
    // Optional: You can add any additional initialization logic here

    // Cleanup function to be called when the application shuts down
    process.on("beforeExit", async () => {
      if (prisma) {
        await prisma.$disconnect();
      }
    });
  }
  return prisma;
};
