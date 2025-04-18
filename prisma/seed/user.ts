import { PrismaClient, type User } from "@prisma/client";
import { hash } from "bcryptjs";

const client = new PrismaClient();

const users: Omit<User, "id">[] = [
  {
    email: "admin@mail.com",
    name: "App Admin",
    image:
      "https://res.cloudinary.com/mokletorg/image/upload/v1710992405/user.svg",
    password: "admin1234#",
    role: "ADMIN",
    emailVerified: new Date(),
  },
];

async function seedUsers() {
  for (const user of users) {
    try {
      const existingUser = await client.user.findUnique({
        where: { email: user.email! },
      });

      if (existingUser) {
        console.log(`User '${user.email}' already exists.`);
        continue;
      }

      const hashedPassword = await hash(user.password!, 12);

      await client.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });

      console.log(`Created user '${user.email}'`);
    } catch (error) {
      console.error(`❌ Failed to create user '${user.email}':`, error);
    }
  }
}

async function main() {
  await seedUsers();
}

main()
  .then(async () => {
    await client.$disconnect();
    console.log("User seeding complete");
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await client.$disconnect();
    process.exit(1);
  });
