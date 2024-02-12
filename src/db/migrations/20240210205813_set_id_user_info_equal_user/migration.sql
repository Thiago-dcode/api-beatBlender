/*
  Warnings:

  - The primary key for the `User_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User_info` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User_info` will be added. If there are existing duplicate values, this will fail.

*/

DROP TABLE "Membership_status" CASCADE;

-- DropForeignKey
ALTER TABLE "User_info" DROP CONSTRAINT "User_info_userId_fkey";

-- DropIndex
DROP INDEX "User_info_userId_key";

-- AlterTable
ALTER TABLE "User_info" DROP CONSTRAINT "User_info_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_info_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "User_info_id_key" ON "User_info"("id");

-- AddForeignKey
ALTER TABLE "User_info" ADD CONSTRAINT "User_info_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
