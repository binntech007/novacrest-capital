-- CreateEnum
CREATE TYPE "DepositRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "DepositRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "cryptoName" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "depositAddress" TEXT NOT NULL,
    "receiptUrl" TEXT NOT NULL,
    "receiptPublicId" TEXT,
    "status" "DepositRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositRequest_reference_key" ON "DepositRequest"("reference");

-- CreateIndex
CREATE INDEX "DepositRequest_userId_idx" ON "DepositRequest"("userId");

-- CreateIndex
CREATE INDEX "DepositRequest_status_idx" ON "DepositRequest"("status");

-- CreateIndex
CREATE INDEX "DepositRequest_createdAt_idx" ON "DepositRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "DepositRequest" ADD CONSTRAINT "DepositRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
