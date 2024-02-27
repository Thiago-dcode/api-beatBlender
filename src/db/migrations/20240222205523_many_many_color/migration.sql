-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_design_keyboardName_fkey";

-- CreateTable
CREATE TABLE "_ColorToDesign_keyboard" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToDesign_keyboard_AB_unique" ON "_ColorToDesign_keyboard"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToDesign_keyboard_B_index" ON "_ColorToDesign_keyboard"("B");

-- AddForeignKey
ALTER TABLE "_ColorToDesign_keyboard" ADD CONSTRAINT "_ColorToDesign_keyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToDesign_keyboard" ADD CONSTRAINT "_ColorToDesign_keyboard_B_fkey" FOREIGN KEY ("B") REFERENCES "Design_keyboard"("name") ON DELETE CASCADE ON UPDATE CASCADE;
