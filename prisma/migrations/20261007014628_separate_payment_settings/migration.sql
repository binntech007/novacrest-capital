-- CreateTable
CREATE TABLE "CryptoDepositAddress" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "instructions" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoDepositAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankPaymentSettings" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "bankName" TEXT NOT NULL,
    "bankAccountName" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "bankRoutingNumber" TEXT,
    "bankSwiftCode" TEXT,
    "bankIban" TEXT,
    "depositInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankPaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CryptoDepositAddress_network_idx" ON "CryptoDepositAddress"("network");

-- CreateIndex
CREATE INDEX "CryptoDepositAddress_enabled_idx" ON "CryptoDepositAddress"("enabled");
