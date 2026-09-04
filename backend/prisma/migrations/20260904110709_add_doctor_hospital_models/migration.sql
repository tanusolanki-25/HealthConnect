/*
  Warnings:

  - Added the required column `consultationFee` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `licenseNo` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "consultationFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ALTER COLUMN "licenseNo" SET NOT NULL;
