-- AlterTable
ALTER TABLE "contract" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[];
