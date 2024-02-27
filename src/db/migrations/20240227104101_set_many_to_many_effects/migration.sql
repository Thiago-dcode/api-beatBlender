/*
  Warnings:

  - You are about to drop the column `effectId` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the column `effectId` on the `Keyboard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_effectId_fkey";

-- DropForeignKey
ALTER TABLE "Keyboard" DROP CONSTRAINT "Keyboard_effectId_fkey";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "effectId";

-- AlterTable
ALTER TABLE "Keyboard" DROP COLUMN "effectId";

-- CreateTable
CREATE TABLE "_EffectToKey" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EffectToKeyboard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EffectToKey_AB_unique" ON "_EffectToKey"("A", "B");

-- CreateIndex
CREATE INDEX "_EffectToKey_B_index" ON "_EffectToKey"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EffectToKeyboard_AB_unique" ON "_EffectToKeyboard"("A", "B");

-- CreateIndex
CREATE INDEX "_EffectToKeyboard_B_index" ON "_EffectToKeyboard"("B");

-- AddForeignKey
ALTER TABLE "_EffectToKey" ADD CONSTRAINT "_EffectToKey_A_fkey" FOREIGN KEY ("A") REFERENCES "Effect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EffectToKey" ADD CONSTRAINT "_EffectToKey_B_fkey" FOREIGN KEY ("B") REFERENCES "Key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EffectToKeyboard" ADD CONSTRAINT "_EffectToKeyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Effect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EffectToKeyboard" ADD CONSTRAINT "_EffectToKeyboard_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
