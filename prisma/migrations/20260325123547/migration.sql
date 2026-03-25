/*
  Warnings:

  - A unique constraint covering the columns `[certificateId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificateId` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "certificateId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateId_key" ON "Certificate"("certificateId");
