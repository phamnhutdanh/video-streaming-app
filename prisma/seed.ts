import { type User, PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const usersFile = path.join(__dirname, "data/user.json");
const users: User[] = JSON.parse(fs.readFileSync(usersFile, "utf-8")) as User[];

async function processInChunks<T, U>(
  items: T[],
  chunkSize: number,
  processItem: (item: T) => Promise<U>,
): Promise<U[]> {
  const results: U[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(processItem);
    results.push(...(await Promise.all(chunkPromises)));
  }
  return results;
}

const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "";

async function main() {
  await prisma.user.deleteMany();

  await processInChunks(users, 1, (user) =>
    prisma.user.upsert({
      where: { id: user.id },
      update: {
        ...user,
        emailVerified: user.emailVerified
          ? new Date(user.emailVerified)
          : undefined,
        image: user.image
          ? `https://res.cloudinary.com/${cloudinaryName}${user.image}`
          : null,
        backgroundImage: user.backgroundImage
          ? `https://res.cloudinary.com/${cloudinaryName}${user.backgroundImage}`
          : null,
      },
      create: {
        ...user,
        emailVerified: user.emailVerified
          ? new Date(user.emailVerified)
          : undefined,
        image: user.image
          ? `https://res.cloudinary.com/${cloudinaryName}${user.image}`
          : null,
        backgroundImage: user.backgroundImage
          ? `https://res.cloudinary.com/${cloudinaryName}${user.backgroundImage}`
          : null,
      },
    }),
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    void prisma.$disconnect();
  });
