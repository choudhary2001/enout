// Mock data seeds for the app
export const mockEvent = {
  id: 'event-1',
  name: 'Brevo Phuket Offsite',
  date: '2025-07-20',
  location: 'Phuket, Thailand',
  description: 'Team building and adventure offsite in beautiful Phuket.',
};

export const mockAttendee = {
  id: 'attendee-1',
  email: '', // Will be set when user verifies email
  firstName: '', // Will be set when user fills registration form
  lastName: '', // Will be set when user fills registration form
  phone: '', // Will be set when user verifies phone
  role: 'guest',
  workEmail: '', // Will be set when user fills registration form
  company: '', // Not collected in current form
  dietaryRequirements: '', // Will be set when user fills registration form (mealPreference)
  emergencyContact: '', // Not collected in current form
  location: '', // Will be set when user fills registration form
  gender: '', // Will be set when user fills registration form
  idCardUrl: null, // Will be set when user uploads ID
};

export const mockMessages = [
  {
    id: 'msg-1',
    subject: 'Welcome to Brevo Phuket Offsite!',
    snippet: 'We are excited to have you join us for this amazing team building adventure...',
    text: 'Dear Tanmay,\n\nWe are excited to have you join us for the Brevo Phuket Offsite! This email contains important information about the event.\n\nEvent Details:\n- Date: July 20-22, 2025\n- Location: Phuket, Thailand\n- Duration: 3 days of team building & adventure\n\nPlease complete your registration and prepare for an unforgettable experience!\n\nBest regards,\nBrevo Team',
    sentAt: 'Today | 09:24 AM',
    unread: true,
    attachmentsCount: 2,
    sender: 'Brevo',
    avatar: 'B',
    attachments: [
      {
        name: 'brevo-phuket-offsite-schedule.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '2.4 MB'
      },
      {
        name: 'welcome-package.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '1.8 MB'
      },
    ],
  },
  {
    id: 'msg-2',
    subject: 'Registration Reminder - Phuket Offsite',
    snippet: 'Don\'t forget to complete your registration for the offsite...',
    text: 'Hi Tanmay,\n\nThis is a friendly reminder to complete your registration for the Brevo Phuket Offsite.\n\nPlease ensure you have:\n- Uploaded your ID card\n- Completed the registration form\n- Verified your phone number\n\nIf you have any questions, please contact us.\n\nBrevo Team',
    sentAt: '1 day ago | 14:43 PM',
    unread: true,
    attachmentsCount: 1,
    sender: 'HR Team',
    avatar: 'H',
    attachments: [
      {
        name: 'registration-checklist.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '856 KB'
      },
    ],
  },
  {
    id: 'msg-3',
    subject: 'Phuket Offsite - What to Pack',
    snippet: 'Essential items to bring for your Phuket adventure...',
    text: 'Hi Tanmay,\n\nGet ready for the Brevo Phuket Offsite! Here\'s what you should pack:\n\nEssentials:\n- Lightweight clothing for tropical weather\n- Sunscreen and hat\n- Comfortable walking shoes\n- Camera for amazing photos\n- Swimsuit for beach activities\n\nWe can\'t wait to see you there!\n\nBrevo Team',
    sentAt: '2 days ago | 10:29 AM',
    unread: false,
    attachmentsCount: 1,
    sender: 'Event Team',
    avatar: 'E',
    attachments: [
      {
        name: 'packing-guide-phuket.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '1.2 MB'
      },
    ],
  },
  {
    id: 'msg-4',
    subject: 'Phuket Offsite - Team Activities',
    snippet: 'Exciting team building activities planned for the offsite...',
    text: 'Hi Tanmay,\n\nWe have amazing team building activities planned for the Phuket Offsite!\n\nActivities Include:\n- Beach volleyball tournament\n- Island hopping adventure\n- Team cooking class\n- Sunset dinner cruise\n- Cultural temple visits\n\nGet ready for an unforgettable experience!\n\nBrevo Team',
    sentAt: '2 days ago | 10:29 AM',
    unread: false,
    attachmentsCount: 2,
    sender: 'Activity Team',
    avatar: 'A',
    attachments: [
      {
        name: 'activity-schedule-detailed.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '3.1 MB'
      },
      {
        name: 'team-building-games.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '2.7 MB'
      },
    ],
  },
  {
    id: 'msg-5',
    subject: 'Phuket Offsite - Travel Information',
    snippet: 'Important travel details and logistics for the offsite...',
    text: 'Hi Tanmay,\n\nHere are the important travel details for the Brevo Phuket Offsite:\n\nTravel Info:\n- Airport: Phuket International Airport (HKT)\n- Hotel: Resort details will be shared soon\n- Transportation: Airport pickup arranged\n- Check-in: July 20, 2025 at 2:00 PM\n\nSafe travels and see you in Phuket!\n\nBrevo Team',
    sentAt: '2 days ago | 10:29 AM',
    unread: false,
    attachmentsCount: 3,
    sender: 'Travel Team',
    avatar: 'T',
    attachments: [
      {
        name: 'travel-itinerary.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '1.5 MB'
      },
      {
        name: 'resort-information.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '2.9 MB'
      },
      {
        name: 'emergency-contacts.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        size: '645 KB'
      },
    ],
  },
];

export const mockSchedule = [
  // Day 1 - July 20, 2025
  {
    id: 'session-1',
    start: '2025-07-20T08:00:00Z',
    end: '2025-07-20T09:00:00Z',
    title: 'Arrival & Check-in',
    location: 'Brevo Resort Phuket',
    notes: 'Welcome to Phuket! Resort check-in and room assignments',
  },
  {
    id: 'session-2',
    start: '2025-07-20T09:30:00Z',
    end: '2025-07-20T10:30:00Z',
    title: 'Welcome Breakfast & Team Introduction',
    location: 'Resort Main Restaurant',
    notes: 'Meet the team and enjoy traditional Thai breakfast',
  },
  {
    id: 'session-3',
    start: '2025-07-20T11:00:00Z',
    end: '2025-07-20T12:30:00Z',
    title: 'Brevo Vision & Goals Session',
    location: 'Resort Conference Hall',
    notes: 'Company vision, goals, and team alignment discussion',
  },
  {
    id: 'session-4',
    start: '2025-07-20T13:00:00Z',
    end: '2025-07-20T14:00:00Z',
    title: 'Lunch Break',
    location: 'Resort Beach Restaurant',
    notes: 'Relaxing lunch with ocean views',
  },
  {
    id: 'session-5',
    start: '2025-07-20T14:30:00Z',
    end: '2025-07-20T16:30:00Z',
    title: 'Beach Volleyball Tournament',
    location: 'Private Beach',
    notes: 'Team building through competitive sports',
  },
  {
    id: 'session-6',
    start: '2025-07-20T17:00:00Z',
    end: '2025-07-20T18:00:00Z',
    title: 'Free Time & Beach Activities',
    location: 'Resort Beach',
    notes: 'Swimming, sunbathing, and beach games',
  },
  {
    id: 'session-7',
    start: '2025-07-20T18:30:00Z',
    end: '2025-07-20T20:30:00Z',
    title: 'Sunset Dinner Cruise',
    location: 'Andaman Sea',
    notes: 'Welcome dinner with stunning sunset views',
  },

  // Day 2 - July 21, 2025
  {
    id: 'session-8',
    start: '2025-07-21T08:00:00Z',
    end: '2025-07-21T09:00:00Z',
    title: 'Morning Yoga & Meditation',
    location: 'Resort Beach Pavilion',
    notes: 'Start the day with mindfulness and team bonding',
  },
  {
    id: 'session-9',
    start: '2025-07-21T09:30:00Z',
    end: '2025-07-21T10:30:00Z',
    title: 'Breakfast & Daily Briefing',
    location: 'Resort Main Restaurant',
    notes: 'Day 2 agenda and team updates',
  },
  {
    id: 'session-10',
    start: '2025-07-21T11:00:00Z',
    end: '2025-07-21T13:00:00Z',
    title: 'Island Hopping Adventure',
    location: 'Phi Phi Islands',
    notes: 'Explore Phi Phi Don and Phi Phi Leh islands',
  },
  {
    id: 'session-11',
    start: '2025-07-21T13:30:00Z',
    end: '2025-07-21T14:30:00Z',
    title: 'Lunch on Phi Phi Island',
    location: 'Phi Phi Don Restaurant',
    notes: 'Fresh seafood lunch on the island',
  },
  {
    id: 'session-12',
    start: '2025-07-21T15:00:00Z',
    end: '2025-07-21T17:00:00Z',
    title: 'Snorkeling & Beach Time',
    location: 'Maya Bay',
    notes: 'Snorkeling in crystal clear waters',
  },
  {
    id: 'session-13',
    start: '2025-07-21T18:00:00Z',
    end: '2025-07-21T19:00:00Z',
    title: 'Return to Resort',
    location: 'Speedboat to Phuket',
    notes: 'Return journey with beautiful sunset views',
  },
  {
    id: 'session-14',
    start: '2025-07-21T19:30:00Z',
    end: '2025-07-21T21:30:00Z',
    title: 'Team Cooking Class',
    location: 'Resort Kitchen',
    notes: 'Learn to cook authentic Thai cuisine together',
  },

  // Day 3 - July 22, 2025
  {
    id: 'session-15',
    start: '2025-07-22T08:00:00Z',
    end: '2025-07-22T09:00:00Z',
    title: 'Morning Beach Walk',
    location: 'Resort Beach',
    notes: 'Peaceful morning walk and team reflection',
  },
  {
    id: 'session-16',
    start: '2025-07-22T09:30:00Z',
    end: '2025-07-22T10:30:00Z',
    title: 'Breakfast & Final Day Briefing',
    location: 'Resort Main Restaurant',
    notes: 'Last day agenda and departure information',
  },
  {
    id: 'session-17',
    start: '2025-07-22T11:00:00Z',
    end: '2025-07-22T12:30:00Z',
    title: 'Cultural Temple Visit',
    location: 'Big Buddha Temple',
    notes: 'Visit the iconic Big Buddha and learn about Thai culture',
  },
  {
    id: 'session-18',
    start: '2025-07-22T13:00:00Z',
    end: '2025-07-22T14:00:00Z',
    title: 'Lunch at Local Restaurant',
    location: 'Phuket Old Town',
    notes: 'Traditional Thai lunch in historic Phuket Town',
  },
  {
    id: 'session-19',
    start: '2025-07-22T14:30:00Z',
    end: '2025-07-22T16:00:00Z',
    title: 'Team Reflection & Planning Session',
    location: 'Resort Conference Room',
    notes: 'Reflect on the offsite experience and plan future goals',
  },
  {
    id: 'session-20',
    start: '2025-07-22T16:30:00Z',
    end: '2025-07-22T17:30:00Z',
    title: 'Farewell & Departure',
    location: 'Resort Lobby',
    notes: 'Final goodbyes and departure to airport',
  },
];
