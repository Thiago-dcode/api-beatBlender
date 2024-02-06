-- AlterTable
ALTER TABLE "Sound_folder" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sound_folder" ADD CONSTRAINT "Sound_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
