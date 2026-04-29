-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'admin_approval';

-- AlterTable
ALTER TABLE "bids" ALTER COLUMN "status" SET DEFAULT 'pending';
