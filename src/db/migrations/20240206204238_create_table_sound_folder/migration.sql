-- AlterTable
ALTER TABLE "Sound" ADD COLUMN     "sound_folderId" INTEGER;

-- CreateTable
CREATE TABLE "Sound_folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sound_folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sound_folder_name_key" ON "Sound_folder"("name");

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_sound_folderId_fkey" FOREIGN KEY ("sound_folderId") REFERENCES "Sound_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
