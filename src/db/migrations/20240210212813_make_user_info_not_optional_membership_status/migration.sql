/*
  Warnings:

  - Made the column `user_infoId` on table `Membership_status` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Membership_status" ALTER COLUMN "user_infoId" SET NOT NULL;
