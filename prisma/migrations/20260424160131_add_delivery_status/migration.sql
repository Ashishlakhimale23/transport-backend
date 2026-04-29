-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('in_transit', 'delivered', 'completed');

-- AlterTable
ALTER TABLE "contract" ADD COLUMN     "deliverableNotes" TEXT DEFAULT '',
ADD COLUMN     "deliveryConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "deliveryStatus" "DeliveryStatus";
