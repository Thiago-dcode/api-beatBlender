/*
  Warnings:

  - You are about to drop the column `auto_renewal` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `membership_id` on the `User_info` table. All the data in the column will be lost.
  - You are about to drop the column `membership_status_id` on the `User_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "auto_renewal";

-- AlterTable
ALTER TABLE "User_info" DROP COLUMN "membership_id",
DROP COLUMN "membership_status_id";

-- CreateTable
CREATE TABLE "Membership_status" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "auto_renewal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "membership_id" INTEGER NOT NULL,
    "user_infoId" INTEGER NOT NULL,

    CONSTRAINT "Membership_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_status_membership_id_key" ON "Membership_status"("membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_status_user_infoId_key" ON "Membership_status"("user_infoId");

-- AddForeignKey
ALTER TABLE "Membership_status" ADD CONSTRAINT "Membership_status_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership_status" ADD CONSTRAINT "Membership_status_user_infoId_fkey" FOREIGN KEY ("user_infoId") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
