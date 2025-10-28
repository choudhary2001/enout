import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminEmail = 'admin@enout.in';
  const adminPassword = 'enout123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create default system user
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@enout.app' },
    update: {},
    create: {
      email: 'system@enout.app',
      name: 'System',
      role: 'ADMIN',
    },
  });

  console.log('Created system user:', systemUser.email);

  // Create sample events
  const brevoEvent = await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      name: 'Brevo Annual Off-site 2025',
      startDate: new Date('2025-01-15T09:00:00Z'),
      endDate: new Date('2025-01-17T18:00:00Z'),
      timezone: 'Asia/Kolkata',
      status: 'complete',
      location: 'Goa, India',
      createdBy: systemUser.id,
    },
  });

  const teamBuildingEvent = await prisma.event.upsert({
    where: { id: 'event-2' },
    update: {},
    create: {
      id: 'event-2',
      name: 'Q2 Team Building',
      startDate: new Date('2025-04-10T10:00:00Z'),
      endDate: new Date('2025-04-10T16:00:00Z'),
      timezone: 'America/New_York',
      status: 'complete',
      location: 'New York, NY',
      createdBy: systemUser.id,
    },
  });

  const productLaunchEvent = await prisma.event.upsert({
    where: { id: 'event-3' },
    update: {},
    create: {
      id: 'event-3',
      name: 'Product Launch Event',
      startDate: new Date('2024-12-01T14:00:00Z'),
      endDate: new Date('2024-12-01T18:00:00Z'),
      timezone: 'America/Los_Angeles',
      status: 'complete',
      location: 'San Francisco, CA',
      createdBy: systemUser.id,
    },
  });

  console.log('Created sample events:');
  console.log('- Brevo Annual Off-site 2025 (complete)');
  console.log('- Q2 Team Building (complete)');
  console.log('- Product Launch Event (complete)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });