/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin";

-- AlterTable
ALTER TABLE "User_info" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
