/*
  Warnings:

  - You are about to drop the column `color` on the `Key` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Key" DROP COLUMN "color",
ADD COLUMN     "bgColor" TEXT,
ADD COLUMN     "keyColor" TEXT;
