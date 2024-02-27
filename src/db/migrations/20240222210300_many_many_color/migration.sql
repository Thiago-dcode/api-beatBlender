/*
  Warnings:

  - The primary key for the `Color` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Color` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ColorToDesign_keyboard" DROP CONSTRAINT "_ColorToDesign_keyboard_A_fkey";

-- AlterTable
ALTER TABLE "Color" DROP CONSTRAINT "Color_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Color_pkey" PRIMARY KEY ("color");

-- AlterTable
ALTER TABLE "_ColorToDesign_keyboard" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_ColorToDesign_keyboard" ADD CONSTRAINT "_ColorToDesign_keyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("color") ON DELETE CASCADE ON UPDATE CASCADE;
