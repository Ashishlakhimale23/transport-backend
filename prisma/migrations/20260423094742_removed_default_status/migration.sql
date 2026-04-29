/*
  Warnings:

  - You are about to drop the column `insuranceValidity` on the `vechiletype` table. All the data in the column will be lost.
  - You are about to drop the `insurance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "insurance" DROP CONSTRAINT "insurance_contractId_fkey";

-- AlterTable
ALTER TABLE "bids" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vechiletype" DROP COLUMN "insuranceValidity";

-- DropTable
DROP TABLE "insurance";

-- DropEnum
DROP TYPE "InsuranceType";
