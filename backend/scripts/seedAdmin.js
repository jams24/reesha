require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

function ask(rl, q, hidden = false) {
  return new Promise((resolve) => {
    if (!hidden) return rl.question(q, (a) => resolve(a));
    const stdin = process.openStdin();
    process.stdout.write(q);
    let value = '';
    const onData = (char) => {
      char = char.toString();
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.removeListener('data', onData);
        stdin.pause();
        process.stdout.write('\n');
        resolve(value);
      } else if (char === '\u0003') {
        process.exit();
      } else {
        value += char;
      }
    };
    stdin.on('data', onData);
  });
}

(async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

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
  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    await existing.save();
    console.log(`Updated existing admin: ${email}`);
  } else {
    await Admin.create({ email, passwordHash, name });
    console.log(`Created admin: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
