import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@enout.com' },
    update: {},
    create: {
      email: 'admin@enout.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
