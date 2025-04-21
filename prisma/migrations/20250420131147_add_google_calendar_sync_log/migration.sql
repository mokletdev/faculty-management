-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'FAILED', 'AUTH_ERROR', 'RATE_LIMITED', 'DELETE_FAILED', 'DELETED');

-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "lastSyncAttempt" TIMESTAMP(3),
ADD COLUMN     "syncError" TEXT,
ADD COLUMN     "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncLog_agendaId_idx" ON "SyncLog"("agendaId");

-- CreateIndex
CREATE INDEX "SyncLog_timestamp_idx" ON "SyncLog"("timestamp");

-- CreateIndex
CREATE INDEX "Agenda_syncStatus_lastSyncAttempt_idx" ON "Agenda"("syncStatus", "lastSyncAttempt");
