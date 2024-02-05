/*
  Warnings:

  - You are about to drop the column `authorId` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Keyboard` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Sound` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Keyboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Sound` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Keyboard" DROP CONSTRAINT "Keyboard_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Sound" DROP CONSTRAINT "Sound_authorId_fkey";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Keyboard" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sound" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Keyboard" ADD CONSTRAINT "Keyboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
