/*
  Warnings:

  - You are about to drop the column `letter` on the `Key` table. All the data in the column will be lost.
  - Added the required column `key` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" DROP COLUMN "letter",
ADD COLUMN     "key" TEXT NOT NULL;
