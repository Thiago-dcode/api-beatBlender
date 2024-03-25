/*
  Warnings:

  - You are about to drop the `_CategoryToKey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToKey" DROP CONSTRAINT "_CategoryToKey_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToKey" DROP CONSTRAINT "_CategoryToKey_B_fkey";

-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "_CategoryToKey";

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
