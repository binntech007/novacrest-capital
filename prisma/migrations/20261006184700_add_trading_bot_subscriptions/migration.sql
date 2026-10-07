-- CreateEnum
CREATE TYPE "TradingBotSubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TradingBotSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "roi" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "TradingBotSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingBotSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradingBotSubscription_userId_idx" ON "TradingBotSubscription"("userId");

-- CreateIndex
CREATE INDEX "TradingBotSubscription_status_idx" ON "TradingBotSubscription"("status");

-- CreateIndex
CREATE INDEX "TradingBotSubscription_userId_status_idx" ON "TradingBotSubscription"("userId", "status");

-- AddForeignKey
ALTER TABLE "TradingBotSubscription" ADD CONSTRAINT "TradingBotSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
