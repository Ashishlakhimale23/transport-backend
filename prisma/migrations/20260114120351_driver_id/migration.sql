/*
  Warnings:

  - Added the required column `driverId` to the `vechiletype` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vechiletype" ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "vechiletype" ADD CONSTRAINT "vechiletype_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
