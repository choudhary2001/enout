import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from both root .env and the one next to schema
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../infra/prisma/.env') });

const prisma = new PrismaClient();

// Explicitly connect to the database
async function connect() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@enout.com' },
    update: {},
    create: {
      email: 'admin@enout.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create HR user
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@enout.com' },
    update: {},
    create: {
      email: 'hr@enout.com',
      name: 'HR Manager',
      role: 'HR',
    },
  });

  console.log('Created users:', { adminUser: adminUser.id, hrUser: hrUser.id });

  // Create event
  const event = await prisma.event.upsert({
    where: { id: 'clq1234567890abcdefghijkl' },
    update: {
      name: 'Brevo Annual Off-site 2025',
      startDate: new Date('2025-07-15T09:00:00+05:30'),
      endDate: new Date('2025-07-18T17:00:00+05:30'),
      timezone: 'Asia/Kolkata',
      status: 'upcoming',
      location: 'Goa, India',
    },
    create: {
      id: 'clq1234567890abcdefghijkl',
      name: 'Brevo Annual Off-site 2025',
      startDate: new Date('2025-07-15T09:00:00+05:30'),
      endDate: new Date('2025-07-18T17:00:00+05:30'),
      timezone: 'Asia/Kolkata',
      status: 'upcoming',
      location: 'Goa, India',
      createdBy: adminUser.id,
    },
  });

  console.log('Created event:', event.id);

  // Delete existing itinerary items for this event
  await prisma.itineraryItem.deleteMany({
    where: { eventId: event.id },
  });

  // Create itinerary items
  const itineraryItems = await Promise.all([
    // Day 1
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Welcome Breakfast',
        start: new Date('2025-07-15T09:00:00+05:30'),
        end: new Date('2025-07-15T10:00:00+05:30'),
        location: 'Main Hall',
      },
    }),
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Keynote: Company Vision 2025',
        start: new Date('2025-07-15T10:30:00+05:30'),
        end: new Date('2025-07-15T12:00:00+05:30'),
        location: 'Conference Room A',
      },
    }),
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Lunch',
        start: new Date('2025-07-15T12:30:00+05:30'),
        end: new Date('2025-07-15T14:00:00+05:30'),
        location: 'Restaurant',
      },
    }),

    // Day 2
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Team Building Activities',
        start: new Date('2025-07-16T09:00:00+05:30'),
        end: new Date('2025-07-16T12:00:00+05:30'),
        location: 'Beach',
        color: '#4CAF50',
      },
    }),
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Department Presentations',
        start: new Date('2025-07-16T14:00:00+05:30'),
        end: new Date('2025-07-16T17:00:00+05:30'),
        location: 'Conference Room B',
      },
    }),

    // Day 3
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Workshop: Future of Work',
        start: new Date('2025-07-17T10:00:00+05:30'),
        end: new Date('2025-07-17T12:00:00+05:30'),
        location: 'Workshop Room',
        notes: 'Bring laptops and ideas!',
      },
    }),
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Free Time / Beach Activities',
        start: new Date('2025-07-17T14:00:00+05:30'),
        end: new Date('2025-07-17T17:00:00+05:30'),
        location: 'Beach',
        color: '#2196F3',
      },
    }),

    // Day 4
    prisma.itineraryItem.create({
      data: {
        eventId: event.id,
        title: 'Closing Ceremony',
        start: new Date('2025-07-18T10:00:00+05:30'),
        end: new Date('2025-07-18T12:00:00+05:30'),
        location: 'Main Hall',
        color: '#9C27B0',
      },
    }),
  ]);

  console.log(`Created ${itineraryItems.length} itinerary items`);

  // Delete existing invites for this event
  await prisma.invite.deleteMany({
    where: { eventId: event.id },
  });

  // Create invites
  const invites = await Promise.all([
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        countryCode: '+1',
        phone: '5551234567',
        status: 'accepted',
        lastSentAt: new Date('2025-06-01T10:00:00Z'),
      },
    }),
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        countryCode: '+1',
        phone: '5559876543',
        status: 'accepted',
        lastSentAt: new Date('2025-06-01T10:05:00Z'),
      },
    }),
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'alex.wong@example.com',
        firstName: 'Alex',
        lastName: 'Wong',
        countryCode: '+65',
        phone: '91234567',
        status: 'pending',
        lastSentAt: new Date('2025-06-01T10:10:00Z'),
      },
    }),
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'maria.garcia@example.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        countryCode: '+34',
        phone: '612345678',
        status: 'pending',
        lastSentAt: new Date('2025-06-01T10:15:00Z'),
      },
    }),
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'raj.patel@example.com',
        firstName: 'Raj',
        lastName: 'Patel',
        countryCode: '+91',
        phone: '9876543210',
        status: 'declined',
        lastSentAt: new Date('2025-06-01T10:20:00Z'),
      },
    }),
    prisma.invite.create({
      data: {
        eventId: event.id,
        email: 'sophie.martin@example.com',
        firstName: 'Sophie',
        lastName: 'Martin',
        countryCode: '+33',
        phone: '612345678',
        status: 'pending',
        lastSentAt: new Date('2025-06-01T10:25:00Z'),
      },
    }),
  ]);

  console.log(`Created ${invites.length} invites`);

  // Delete existing attendees for this event
  await prisma.attendee.deleteMany({
    where: { eventId: event.id },
  });

  // Create attendees
  const attendees = await Promise.all([
    prisma.attendee.create({
      data: {
        eventId: event.id,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+15551234567',
        city: 'New York',
        mealPref: 'Vegetarian',
        drinkPref: 'Wine',
        acceptedAt: new Date('2025-06-02T14:30:00Z'),
        tasksJson: { basic: true, phone: true, id: false },
        phoneVerified: true,
      },
    }),
    prisma.attendee.create({
      data: {
        eventId: event.id,
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+15559876543',
        city: 'San Francisco',
        mealPref: 'No restrictions',
        drinkPref: 'Beer',
        acceptedAt: new Date('2025-06-03T09:15:00Z'),
        tasksJson: { basic: true, phone: true, id: true },
        idDocUrl: 'https://storage.example.com/id-docs/jane-smith-passport.jpg',
        phoneVerified: true,
      },
    }),
    prisma.attendee.create({
      data: {
        eventId: event.id,
        email: 'alex.wong@example.com',
        firstName: 'Alex',
        lastName: 'Wong',
        phone: '+6591234567',
        city: 'Singapore',
        mealPref: 'Seafood allergy',
        acceptedAt: new Date('2025-06-05T16:45:00Z'),
        tasksJson: { basic: true, phone: false, id: false },
        phoneVerified: false,
      },
    }),
    prisma.attendee.create({
      data: {
        eventId: event.id,
        email: 'maria.garcia@example.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        phone: '+34612345678',
        city: 'Madrid',
        mealPref: 'Vegan',
        drinkPref: 'Non-alcoholic',
        acceptedAt: new Date('2025-06-07T11:20:00Z'),
        tasksJson: { basic: true, phone: false, id: false },
        phoneVerified: false,
      },
    }),
  ]);

  console.log(`Created ${attendees.length} attendees`);

  // Delete existing rooms for this event
  await prisma.room.deleteMany({
    where: { eventId: event.id },
  });

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        eventId: event.id,
        roomNo: '101',
        category: 'Standard',
        maxGuests: 2,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        roomNo: '201',
        category: 'Deluxe',
        maxGuests: 2,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        roomNo: '301',
        category: 'Suite',
        maxGuests: 3,
      },
    }),
  ]);

  console.log(`Created ${rooms.length} rooms`);

  // Delete existing room assignments for this event
  await prisma.roomAssignment.deleteMany({
    where: { eventId: event.id },
  });

  // Create room assignments
  const roomAssignments = await Promise.all([
    prisma.roomAssignment.create({
      data: {
        eventId: event.id,
        roomId: rooms[0].id,
        attendeeId: attendees[0].id,
        slot: 1,
      },
    }),
    prisma.roomAssignment.create({
      data: {
        eventId: event.id,
        roomId: rooms[1].id,
        attendeeId: attendees[1].id,
        slot: 1,
      },
    }),
  ]);

  console.log(`Created ${roomAssignments.length} room assignments`);

  // Delete existing broadcasts for this event
  await prisma.broadcast.deleteMany({
    where: { eventId: event.id },
  });

  // Create broadcasts
  const broadcasts = await Promise.all([
    prisma.broadcast.create({
      data: {
        eventId: event.id,
        subject: 'Welcome to Brevo Annual Off-site 2025',
        bodyHtml: '<h1>Welcome!</h1><p>We are excited to have you join us for the annual off-site event in Goa.</p><p>Please find attached the event schedule and travel information.</p>',
        status: 'draft',
        createdBy: adminUser.id,
      },
    }),
    prisma.broadcast.create({
      data: {
        eventId: event.id,
        subject: 'Important Updates for Brevo Off-site',
        bodyHtml: '<h1>Updates</h1><p>Please note the following updates to our schedule:</p><ul><li>Beach activities moved to Wednesday afternoon</li><li>Additional workshop added on Thursday morning</li></ul>',
        status: 'draft',
        createdBy: hrUser.id,
      },
    }),
    prisma.broadcast.create({
      data: {
        eventId: event.id,
        subject: 'Final Confirmation: Brevo Off-site 2025',
        bodyHtml: '<h1>Confirmed!</h1><p>Your participation in the Brevo Annual Off-site is confirmed. We look forward to seeing you in Goa!</p><p>Please download the mobile app to access your digital badge and event information.</p>',
        status: 'sent',
        sentAt: new Date('2025-06-15T09:00:00Z'),
        createdBy: adminUser.id,
        attachments: {
          create: [
            {
              name: 'event_schedule.pdf',
              url: 'https://storage.example.com/attachments/event_schedule.pdf',
              mime: 'application/pdf',
              size: 1024 * 1024 * 2, // 2MB
            },
            {
              name: 'travel_guide.pdf',
              url: 'https://storage.example.com/attachments/travel_guide.pdf',
              mime: 'application/pdf',
              size: 1024 * 1024 * 3, // 3MB
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${broadcasts.length} broadcasts`);

  // Delete existing mobile messages for this event
  await prisma.mobileMessage.deleteMany({
    where: { eventId: event.id },
  });

  // Create mobile messages
  const mobileMessages = await Promise.all([
    prisma.mobileMessage.create({
      data: {
        eventId: event.id,
        attendeeId: attendees[0].id,
        title: 'Welcome to the Event!',
        body: 'Thank you for joining us at the Brevo Annual Off-site 2025. Your digital badge is now active.',
        unread: false,
        createdAt: new Date('2025-07-15T08:30:00+05:30'),
      },
    }),
    prisma.mobileMessage.create({
      data: {
        eventId: event.id,
        attendeeId: attendees[0].id,
        title: 'Room Assignment Confirmed',
        body: 'Your room assignment has been confirmed. You are in Room 101.',
        unread: true,
        createdAt: new Date('2025-07-15T09:15:00+05:30'),
      },
    }),
    prisma.mobileMessage.create({
      data: {
        eventId: event.id,
        attendeeId: attendees[1].id,
        title: 'Welcome to the Event!',
        body: 'Thank you for joining us at the Brevo Annual Off-site 2025. Your digital badge is now active.',
        unread: false,
        createdAt: new Date('2025-07-15T08:30:00+05:30'),
      },
    }),
    prisma.mobileMessage.create({
      data: {
        eventId: event.id,
        title: 'Keynote Starting Soon',
        body: 'The keynote presentation will begin in 15 minutes in Conference Room A. Please take your seats.',
        attachments: { 
          map: { 
            url: 'https://storage.example.com/maps/conference_room_a.jpg' 
          } 
        },
        createdAt: new Date('2025-07-15T10:15:00+05:30'),
      },
    }),
  ]);

  console.log(`Created ${mobileMessages.length} mobile messages`);

  console.log('Seeding completed successfully!');
}

// Run the seed function
connect()
  .then(() => main())
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting from database');
    await prisma.$disconnect();
  });
