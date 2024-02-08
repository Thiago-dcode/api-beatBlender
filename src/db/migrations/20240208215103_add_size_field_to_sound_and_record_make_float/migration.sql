-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "size" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Sound" ALTER COLUMN "size" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "User_info" (
    "id" SERIAL NOT NULL,
    "space" DOUBLE PRECISION NOT NULL,
    "keyboards" INTEGER NOT NULL,
    "sounds" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "User_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_info" ADD CONSTRAINT "User_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
