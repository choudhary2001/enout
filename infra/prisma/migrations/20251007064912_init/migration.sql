-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('ADMIN', 'HR');

-- CreateEnum
CREATE TYPE "admin_roles" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "user_roles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_items" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "color" TEXT,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'meeting',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "itinerary_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "countryCode" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "dietaryRequirements" TEXT,
    "drinkPref" TEXT,
    "workEmail" TEXT,
    "location" TEXT,
    "gender" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "tasksJson" JSONB NOT NULL DEFAULT '{}',
    "idDocUrl" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "derivedStatus" TEXT NOT NULL DEFAULT 'not_invited',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_assignments" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "attendeeId" TEXT NOT NULL,

    CONSTRAINT "room_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broadcasts" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "audience" TEXT NOT NULL DEFAULT 'all',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broadcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_messages" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "attendeeId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" JSONB,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mobile_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "admin_roles" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "itinerary_items_eventId_start_end_idx" ON "itinerary_items"("eventId", "start", "end");

-- CreateIndex
CREATE INDEX "itinerary_items_eventId_order_idx" ON "itinerary_items"("eventId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "invites_eventId_email_key" ON "invites"("eventId", "email");

-- CreateIndex
CREATE INDEX "attendees_eventId_derivedStatus_idx" ON "attendees"("eventId", "derivedStatus");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_eventId_email_key" ON "attendees"("eventId", "email");

-- CreateIndex
CREATE INDEX "rooms_eventId_category_idx" ON "rooms"("eventId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_eventId_roomNo_key" ON "rooms"("eventId", "roomNo");

-- CreateIndex
CREATE UNIQUE INDEX "room_assignments_attendeeId_key" ON "room_assignments"("attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "room_assignments_eventId_attendeeId_key" ON "room_assignments"("eventId", "attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "room_assignments_roomId_slot_key" ON "room_assignments"("roomId", "slot");

-- CreateIndex
CREATE INDEX "broadcasts_eventId_status_idx" ON "broadcasts"("eventId", "status");

-- CreateIndex
CREATE INDEX "broadcasts_eventId_sentAt_idx" ON "broadcasts"("eventId", "sentAt");

-- CreateIndex
CREATE INDEX "mobile_messages_eventId_createdAt_idx" ON "mobile_messages"("eventId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_adminId_idx" ON "refresh_tokens"("adminId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_assignments" ADD CONSTRAINT "room_assignments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_assignments" ADD CONSTRAINT "room_assignments_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_assignments" ADD CONSTRAINT "room_assignments_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcasts" ADD CONSTRAINT "broadcasts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcasts" ADD CONSTRAINT "broadcasts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "broadcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_messages" ADD CONSTRAINT "mobile_messages_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_messages" ADD CONSTRAINT "mobile_messages_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
