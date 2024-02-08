-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_userId_fkey";

-- DropForeignKey
ALTER TABLE "Keyboard" DROP CONSTRAINT "Keyboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_keyboardId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sound" DROP CONSTRAINT "Sound_sound_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Sound" DROP CONSTRAINT "Sound_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sound_folder" DROP CONSTRAINT "Sound_folder_userId_fkey";

-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "keyboardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Keyboard" ADD CONSTRAINT "Keyboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_sound_folderId_fkey" FOREIGN KEY ("sound_folderId") REFERENCES "Sound_folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sound_folder" ADD CONSTRAINT "Sound_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_keyboardId_fkey" FOREIGN KEY ("keyboardId") REFERENCES "Keyboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
