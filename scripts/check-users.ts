import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      passwordHash: true,
      name: true,
      providerProfile: { select: { approved: true, businessName: true } },
      ambassadorProfile: { select: { code: true } },
    },
    orderBy: { email: "asc" },
  });

  console.log("USER_COUNT", users.length);
  for (const u of users) {
    const demoPasswordOk = u.passwordHash
      ? await bcrypt.compare("Demo1234!", u.passwordHash)
      : false;
    console.log(
      JSON.stringify({
        email: u.email,
        role: u.role,
        name: u.name,
        demoPasswordOk,
        provider: u.providerProfile,
        ambassador: u.ambassadorProfile,
      }),
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
