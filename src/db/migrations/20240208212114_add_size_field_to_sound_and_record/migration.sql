/*
  Warnings:

  - Added the required column `size` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Sound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sound" ADD COLUMN     "size" INTEGER NOT NULL;
