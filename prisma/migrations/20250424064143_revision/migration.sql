/*
  Warnings:

  - The primary key for the `GoogleGroupShareable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `GoogleGroupShareable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoogleGroupShareable" DROP CONSTRAINT "GoogleGroupShareable_pkey",
DROP COLUMN "groupId",
ADD CONSTRAINT "GoogleGroupShareable_pkey" PRIMARY KEY ("groupEmail");
