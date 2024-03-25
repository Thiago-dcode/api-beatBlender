-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_categoryId_fkey";

-- AlterTable
ALTER TABLE "Key" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
