/*
  Warnings:

  - You are about to drop the `_EffectToKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EffectToKeyboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EffectToKey" DROP CONSTRAINT "_EffectToKey_A_fkey";

-- DropForeignKey
ALTER TABLE "_EffectToKey" DROP CONSTRAINT "_EffectToKey_B_fkey";

-- DropForeignKey
ALTER TABLE "_EffectToKeyboard" DROP CONSTRAINT "_EffectToKeyboard_A_fkey";

-- DropForeignKey
ALTER TABLE "_EffectToKeyboard" DROP CONSTRAINT "_EffectToKeyboard_B_fkey";

-- DropIndex
DROP INDEX "Effect_name_key";

-- AlterTable
ALTER TABLE "Effect" ADD COLUMN     "keyId" INTEGER,
ADD COLUMN     "keyboardId" INTEGER;

-- DropTable
DROP TABLE "_EffectToKey";

-- DropTable
DROP TABLE "_EffectToKeyboard";

-- AddForeignKey
ALTER TABLE "Effect" ADD CONSTRAINT "Effect_keyboardId_fkey" FOREIGN KEY ("keyboardId") REFERENCES "Keyboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Effect" ADD CONSTRAINT "Effect_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "Key"("id") ON DELETE SET NULL ON UPDATE CASCADE;
