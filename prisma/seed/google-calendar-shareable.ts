import { PrismaClient, type GoogleCalendarShareable } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const client = new PrismaClient();

if (!process.env.GOOGLE_CALENDAR_ID)
  throw new Error("Cannot find GOOGLE_CALENDAR_ID in the env file.");

const googleCalendarShareable: GoogleCalendarShareable = {
  calendarId: process.env.GOOGLE_CALENDAR_ID,
};

async function seedCalendarShareable() {
  try {
    const existingCalendarShareable =
      await client.googleCalendarShareable.findFirst();

    if (existingCalendarShareable) {
      console.log(`Calendar Shareable already exists.`);
      return;
    }

    await client.googleCalendarShareable.create({
      data: googleCalendarShareable,
    });

    console.log(`Created Google Calendar Shareable object`);
  } catch (error) {
    console.error(
      `❌ Failed to create Google Calendar Shareable object:`,
      error,
    );
  }
}

async function main() {
  await seedCalendarShareable();
}

main()
  .then(async () => {
    await client.$disconnect();
    console.log("Calendar Shareable seeding complete");
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await client.$disconnect();
    process.exit(1);
  });
