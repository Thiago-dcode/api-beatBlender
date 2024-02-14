/*
  Warnings:

  - You are about to drop the column `keyboardId` on the `Key` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_keyboardId_fkey";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "keyboardId";

-- CreateTable
CREATE TABLE "_KeyToKeyboard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_KeyToKeyboard_AB_unique" ON "_KeyToKeyboard"("A", "B");

-- CreateIndex
CREATE INDEX "_KeyToKeyboard_B_index" ON "_KeyToKeyboard"("B");

-- AddForeignKey
ALTER TABLE "_KeyToKeyboard" ADD CONSTRAINT "_KeyToKeyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeyToKeyboard" ADD CONSTRAINT "_KeyToKeyboard_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
