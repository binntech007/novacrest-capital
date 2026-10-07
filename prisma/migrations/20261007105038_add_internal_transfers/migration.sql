-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('INVESTMENT_TO_MAIN', 'CUSTOMER_TO_CUSTOMER');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "InternalTransfer" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT,
    "type" "TransferType" NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "recipientEmail" TEXT,
    "description" TEXT,
    "status" "TransferStatus" NOT NULL DEFAULT 'COMPLETED',
    "reference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternalTransfer_reference_key" ON "InternalTransfer"("reference");

-- CreateIndex
CREATE INDEX "InternalTransfer_senderId_createdAt_idx" ON "InternalTransfer"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "InternalTransfer_recipientId_createdAt_idx" ON "InternalTransfer"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "InternalTransfer_type_idx" ON "InternalTransfer"("type");

-- CreateIndex
CREATE INDEX "InternalTransfer_status_idx" ON "InternalTransfer"("status");

-- AddForeignKey
ALTER TABLE "InternalTransfer" ADD CONSTRAINT "InternalTransfer_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalTransfer" ADD CONSTRAINT "InternalTransfer_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
