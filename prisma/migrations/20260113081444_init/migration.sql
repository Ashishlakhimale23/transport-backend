-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'contractor', 'driver');

-- CreateEnum
CREATE TYPE "VehicleWheel" AS ENUM ('4', '6', '10', '12');

-- CreateEnum
CREATE TYPE "GoodsType" AS ENUM ('handlewithcare', 'automobile');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('open', 'semiopen', 'container');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('basic', 'pro', 'maxsaver');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "role" "UserRole" NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "contact" INTEGER NOT NULL,
    "regularPracticeLocation" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" SERIAL NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "dropDate" TIMESTAMP(3) NOT NULL,
    "startLocation" VARCHAR(100) NOT NULL,
    "endLocation" VARCHAR(100) NOT NULL,
    "approxKms" INTEGER NOT NULL,
    "contractorId" INTEGER NOT NULL,
    "goodsCarrierId" INTEGER,
    "typeOfVehicle" "VehicleWheel" NOT NULL,
    "insured" BOOLEAN NOT NULL,
    "winningPrice" INTEGER,
    "type" "GoodsType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vechiletype" (
    "id" SERIAL NOT NULL,
    "wheelers" "VehicleWheel" NOT NULL,
    "category" "VehicleCategory" NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "insuranceValidity" BOOLEAN NOT NULL,

    CONSTRAINT "vechiletype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "type" "InsuranceType" NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "insurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insurance_contractId_key" ON "insurance"("contractId");

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_goodsCarrierId_fkey" FOREIGN KEY ("goodsCarrierId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
