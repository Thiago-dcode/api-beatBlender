/*
  Warnings:

  - Made the column `size` on table `Record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `Sound` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Sound" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0;
