/*
  Warnings:

  - You are about to drop the column `documentBackUrl` on the `KycApplication` table. All the data in the column will be lost.
  - You are about to drop the column `documentFrontUrl` on the `KycApplication` table. All the data in the column will be lost.
  - You are about to drop the column `selfieUrl` on the `KycApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KycApplication" DROP COLUMN "documentBackUrl",
DROP COLUMN "documentFrontUrl",
DROP COLUMN "selfieUrl",
ADD COLUMN     "documentBackId" TEXT,
ADD COLUMN     "documentFrontId" TEXT,
ADD COLUMN     "selfieId" TEXT;
