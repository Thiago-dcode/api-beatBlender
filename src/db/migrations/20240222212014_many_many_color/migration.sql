/*
  Warnings:

  - The primary key for the `Color` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `A` on the `_ColorToDesign_keyboard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_ColorToDesign_keyboard" DROP CONSTRAINT "_ColorToDesign_keyboard_A_fkey";

-- AlterTable
ALTER TABLE "Color" DROP CONSTRAINT "Color_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Color_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_ColorToDesign_keyboard" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToDesign_keyboard_AB_unique" ON "_ColorToDesign_keyboard"("A", "B");

-- AddForeignKey
ALTER TABLE "_ColorToDesign_keyboard" ADD CONSTRAINT "_ColorToDesign_keyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;
