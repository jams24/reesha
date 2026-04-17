require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/db');

function ask(rl, q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set in .env');
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const email = (await ask(rl, 'Admin email: ')).trim().toLowerCase();
  const name = (await ask(rl, 'Admin name (default "Reesha"): ')).trim() || 'Reesha';
  const password = (await ask(rl, 'Password: ')).trim();
  rl.close();

  if (!email || !password) {
    console.error('Email and password required');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  console.log(`${admin.createdAt.getTime() === admin.updatedAt.getTime() ? 'Created' : 'Updated'} admin: ${admin.email}`);
  await prisma.$disconnect();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
