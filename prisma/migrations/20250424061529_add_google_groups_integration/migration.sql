-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SyncStatus" ADD VALUE 'GROUP_INVITE_PENDING';
ALTER TYPE "SyncStatus" ADD VALUE 'GROUP_INVITE_SENT';
ALTER TYPE "SyncStatus" ADD VALUE 'GROUP_INVITE_FAILED';

-- DropIndex
DROP INDEX "GoogleCalendarShareable_calendarId_key";

-- CreateTable
CREATE TABLE "GoogleGroupShareable" (
    "groupEmail" TEXT NOT NULL,
    "groupName" TEXT,
    "description" TEXT,

    CONSTRAINT "GoogleGroupShareable_pkey" PRIMARY KEY ("groupEmail")
);
