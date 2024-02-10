-- DropForeignKey
ALTER TABLE "Membership_status" DROP CONSTRAINT "Membership_status_membership_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership_status" DROP CONSTRAINT "Membership_status_user_infoId_fkey";

-- DropForeignKey
ALTER TABLE "User_info" DROP CONSTRAINT "User_info_userId_fkey";

-- AddForeignKey
ALTER TABLE "User_info" ADD CONSTRAINT "User_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership_status" ADD CONSTRAINT "Membership_status_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership_status" ADD CONSTRAINT "Membership_status_user_infoId_fkey" FOREIGN KEY ("user_infoId") REFERENCES "User_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
