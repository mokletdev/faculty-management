import { PrismaClient, type GoogleGroupShareable } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const client = new PrismaClient();

if (!process.env.GOOGLE_GROUP_EMAIL)
  throw new Error("Cannot find GOOGLE_GROUP_EMAIL in the env file.");

const googleGroupShareable: GoogleGroupShareable = {
  groupEmail: process.env.GOOGLE_GROUP_EMAIL,
  groupName: "FEMS Group",
  description: "Google Groups of FEMS.",
};

async function seedGroupShareable() {
  try {
    const existingGroupShareable =
      await client.googleGroupShareable.findFirst();

    if (existingGroupShareable) {
      console.log(`Group Shareable already exists.`);
      return;
    }

    await client.googleGroupShareable.create({
      data: googleGroupShareable,
    });

    console.log(`Created Google Group Shareable object`);
  } catch (error) {
    console.error(`❌ Failed to create Google Group Shareable object:`, error);
  }
}

async function main() {
  await seedGroupShareable();
}

main()
  .then(async () => {
    await client.$disconnect();
    console.log("Group Shareable seeding complete");
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await client.$disconnect();
    process.exit(1);
  });
