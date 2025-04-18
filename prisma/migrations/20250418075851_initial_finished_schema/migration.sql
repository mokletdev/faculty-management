/*
  Warnings:

  - The values [LECTURER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CREATED', 'UPDATED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'DOSEN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DOSEN';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DOSEN';

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "googleEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessMahasiswa" BOOLEAN NOT NULL DEFAULT false,
    "accessAllDosen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaAccess" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AgendaAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "agendaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agenda_startTime_endTime_roomId_idx" ON "Agenda"("startTime", "endTime", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_startTime_endTime_roomId_key" ON "Agenda"("startTime", "endTime", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "AgendaAccess_agendaId_userId_key" ON "AgendaAccess"("agendaId", "userId");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaAccess" ADD CONSTRAINT "AgendaAccess_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaAccess" ADD CONSTRAINT "AgendaAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
