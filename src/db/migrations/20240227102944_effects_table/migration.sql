-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "effectId" INTEGER;

-- AlterTable
ALTER TABLE "Keyboard" ADD COLUMN     "effectId" INTEGER;

-- CreateTable
CREATE TABLE "Effect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,

    CONSTRAINT "Effect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Effect_name_key" ON "Effect"("name");

-- AddForeignKey
ALTER TABLE "Keyboard" ADD CONSTRAINT "Keyboard_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "Effect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "Effect"("id") ON DELETE SET NULL ON UPDATE CASCADE;
