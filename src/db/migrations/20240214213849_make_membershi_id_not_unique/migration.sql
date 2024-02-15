/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Design_keyboard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Membership_status_membership_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Design_keyboard_name_key" ON "Design_keyboard"("name");
