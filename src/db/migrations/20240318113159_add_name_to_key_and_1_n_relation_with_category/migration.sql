/*
  Warnings:

  - Made the column `name` on table `Key` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Key" ALTER COLUMN "name" SET NOT NULL;
