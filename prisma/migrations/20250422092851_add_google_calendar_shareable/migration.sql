-- CreateTable
CREATE TABLE "GoogleCalendarShareable" (
    "shareableUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendarShareable_shareableUrl_key" ON "GoogleCalendarShareable"("shareableUrl");
