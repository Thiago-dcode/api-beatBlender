-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_membershipId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "membershipId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
