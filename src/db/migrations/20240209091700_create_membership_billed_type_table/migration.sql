-- CreateTable
CREATE TABLE "Membership_type" (
    "id" SERIAL NOT NULL,
    "billed" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Membership_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_type_billed_key" ON "Membership_type"("billed");
