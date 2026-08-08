/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_hospitalId_fkey";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "hospitalId",
ADD COLUMN     "hospitalName" TEXT;
