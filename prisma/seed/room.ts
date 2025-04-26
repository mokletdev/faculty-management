import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const rooms = [
  {
    name: "Conference Room A",
    location: "1st Floor, Building A",
  },
  {
    name: "Meeting Room B",
    location: "2nd Floor, Building B",
  },
  {
    name: "Executive Lounge",
    location: "3rd Floor, HQ",
  },
  {
    name: "Training Room 1",
    location: "Ground Floor, Annex",
  },
  {
    name: "Boardroom",
    location: "Top Floor, Main Office",
  },
  {
    name: "Virtual Meeting Room",
    location: null,
  },
];

async function seedRooms() {
  try {
    const existingRoom = await client.room.findFirst();
    if (existingRoom) {
      console.log("There's already room data in the database.");
      return;
    }

    await client.room.createMany({
      data: rooms,
    });

    console.log(`Created rooms`);
  } catch (error) {
    console.error(`❌ Failed to create rooms:`, error);
  }
}

async function main() {
  await seedRooms();
}

main()
  .then(async () => {
    await client.$disconnect();
    console.log("Rooms seeding complete");
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await client.$disconnect();
    process.exit(1);
  });
