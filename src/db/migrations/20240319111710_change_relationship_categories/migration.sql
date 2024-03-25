/*
  Warnings:

  - You are about to drop the `_CategoryToSound` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToSound" DROP CONSTRAINT "_CategoryToSound_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSound" DROP CONSTRAINT "_CategoryToSound_B_fkey";

-- AlterTable
ALTER TABLE "Sound" ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "_CategoryToSound";

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
