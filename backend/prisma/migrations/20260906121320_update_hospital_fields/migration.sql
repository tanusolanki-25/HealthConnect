/*
  Warnings:

  - You are about to drop the column `registrationNo` on the `Hospital` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "registrationNo",
ADD COLUMN     "beds" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'India',
ADD COLUMN     "departmentsCount" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "doctorsCount" INTEGER,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "is24Hours" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openingTime" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "website" TEXT;
