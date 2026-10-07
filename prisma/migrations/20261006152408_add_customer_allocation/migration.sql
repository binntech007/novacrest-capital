-- CreateTable
CREATE TABLE "CustomerAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeInvestmentAmount" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "tradingBotAmount" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAllocation_userId_key" ON "CustomerAllocation"("userId");

-- CreateIndex
CREATE INDEX "CustomerAllocation_userId_idx" ON "CustomerAllocation"("userId");

-- AddForeignKey
ALTER TABLE "CustomerAllocation" ADD CONSTRAINT "CustomerAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
