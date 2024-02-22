/*
  Warnings:

  - You are about to drop the column `design_keyId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `design_keyId` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the `Design_key` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[color]` on the table `Color` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_design_keyId_fkey";

-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_design_keyId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "design_keyId";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "design_keyId";

-- DropTable
DROP TABLE "Design_key";

-- CreateIndex
CREATE UNIQUE INDEX "Color_color_key" ON "Color"("color");
