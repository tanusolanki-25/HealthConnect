/*
  Warnings:

  - You are about to drop the column `contact` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('google', 'github');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "contact",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "existingDiseases" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "relationship" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailValid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OauthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_key" ON "Otp"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OauthAccount_userId_key" ON "OauthAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OauthAccount_providerAccountId_key" ON "OauthAccount"("providerAccountId");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OauthAccount" ADD CONSTRAINT "OauthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
