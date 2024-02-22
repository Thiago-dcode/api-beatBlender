/*
  Warnings:

  - Added the required column `path` to the `Design_keyboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Design_keyboard" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "path" TEXT NOT NULL;
