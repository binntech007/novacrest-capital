-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "KycDocumentType" AS ENUM ('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE');

-- CreateTable
CREATE TABLE "KycApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "documentType" "KycDocumentType",
    "documentNumber" TEXT,
    "documentFrontUrl" TEXT,
    "documentBackUrl" TEXT,
    "selfieUrl" TEXT,
    "rejectionReason" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KycApplication_userId_key" ON "KycApplication"("userId");

-- CreateIndex
CREATE INDEX "KycApplication_status_idx" ON "KycApplication"("status");

-- CreateIndex
CREATE INDEX "KycApplication_reviewedById_idx" ON "KycApplication"("reviewedById");

-- AddForeignKey
ALTER TABLE "KycApplication" ADD CONSTRAINT "KycApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycApplication" ADD CONSTRAINT "KycApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
