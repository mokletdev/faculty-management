/*
  Warnings:

  - You are about to drop the column `shareableUrl` on the `GoogleCalendarShareable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[calendarId]` on the table `GoogleCalendarShareable` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `calendarId` to the `GoogleCalendarShareable` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GoogleCalendarShareable_shareableUrl_key";

-- AlterTable
ALTER TABLE "GoogleCalendarShareable" DROP COLUMN "shareableUrl",
ADD COLUMN     "calendarId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendarShareable_calendarId_key" ON "GoogleCalendarShareable"("calendarId");
