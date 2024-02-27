/*
  Warnings:

  - You are about to drop the column `design_keyboardId` on the `Color` table. All the data in the column will be lost.
  - The primary key for the `Design_keyboard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Design_keyboard` table. All the data in the column will be lost.
  - You are about to drop the column `design_keyboardId` on the `Keyboard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_design_keyboardId_fkey";

-- DropForeignKey
ALTER TABLE "Keyboard" DROP CONSTRAINT "Keyboard_design_keyboardId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "design_keyboardId",
ADD COLUMN     "design_keyboardName" TEXT;

-- AlterTable
ALTER TABLE "Design_keyboard" DROP CONSTRAINT "Design_keyboard_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Design_keyboard_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Keyboard" DROP COLUMN "design_keyboardId",
ADD COLUMN     "design_keyboardName" TEXT;

-- AddForeignKey
ALTER TABLE "Keyboard" ADD CONSTRAINT "Keyboard_design_keyboardName_fkey" FOREIGN KEY ("design_keyboardName") REFERENCES "Design_keyboard"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_design_keyboardName_fkey" FOREIGN KEY ("design_keyboardName") REFERENCES "Design_keyboard"("name") ON DELETE SET NULL ON UPDATE CASCADE;
