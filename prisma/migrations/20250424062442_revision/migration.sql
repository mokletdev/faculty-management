/*
  Warnings:

  - The primary key for the `GoogleGroupShareable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `groupId` to the `GoogleGroupShareable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoogleGroupShareable" DROP CONSTRAINT "GoogleGroupShareable_pkey",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD CONSTRAINT "GoogleGroupShareable_pkey" PRIMARY KEY ("groupId");
