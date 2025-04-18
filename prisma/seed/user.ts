import { PrismaClient, type User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

const users: User[] = [
  {
    id: uuidv4(),
    email: "admin@mail.com",
    name: "Ini Admin",
    image: "https://media.tenor.com/tGt3c0NDF4oAAAAM/aku.gif",
    password: "admin1234#",
    role: "ADMIN",
    emailVerified: null,
  },
];

async function main() {
  for await (const user of users) {
    const userExists = await client.user.findUnique({
      where: {
        email: user.email!,
      },
    });

    if (userExists) return console.log(`User ${user.name} already exists`);

    await client.user.create({
      data: user,
    });

    console.log(`Created User ${user.name}`);
  }
}

main()
  .then(async (i) => {
    await client.$disconnect();
    console.log("Seeded the user table!");
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
