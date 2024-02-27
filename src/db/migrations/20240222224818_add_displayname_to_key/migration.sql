/*
  Warnings:

  - Added the required column `displayName` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "displayName" TEXT NOT NULL;
