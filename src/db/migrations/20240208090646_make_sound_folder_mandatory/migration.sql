/*
  Warnings:

  - Made the column `sound_folderId` on table `Sound` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Sound_folder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sound" DROP CONSTRAINT "Sound_sound_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Sound_folder" DROP CONSTRAINT "Sound_folder_userId_fkey";

-- AlterTable
ALTER TABLE "Sound" ALTER COLUMN "sound_folderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sound_folder" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_sound_folderId_fkey" FOREIGN KEY ("sound_folderId") REFERENCES "Sound_folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sound_folder" ADD CONSTRAINT "Sound_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
