/*
  Warnings:

  - You are about to drop the column `membershipId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_membershipId_fkey";

-- DropIndex
DROP INDEX "User_membershipId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "membershipId";
