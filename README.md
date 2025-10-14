# Enout Event Management App

A comprehensive event management application built with modern web technologies.

## 🏗️ Architecture

This is a monorepo containing:

- **Admin Dashboard** (`apps/admin/`) - Next.js React app for event management
- **API Server** (`apps/api/`) - NestJS backend with Prisma ORM
- **Mobile App** (`apps/mobile/`) - React Native/Expo mobile application
- **Shared Packages** (`packages/`) - Common utilities and UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Redis (optional, for caching)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env

# Set up database
cd apps/api
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

### Development

```bash
# Start API server (port 3006)
pnpm --filter @enout/api dev

# Start admin dashboard (port 3000)
pnpm --filter @enout/admin dev

# Start mobile app
pnpm --filter enout-mobile start
```

## 📱 Features

### Admin Dashboard
- Event management (create, edit, delete events)
- Guest management with bulk actions
- Rooming plan and room assignments
- Message broadcasting system with drafts
- Schedule management
- Real-time updates

### API Features
- RESTful API with NestJS
- Authentication and authorization
- Database management with Prisma
- Rate limiting and security
- Comprehensive error handling

### Mobile App
- Cross-platform (iOS/Android/Web)
- Event browsing and details
- Guest check-in functionality
- Real-time notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, Prisma, PostgreSQL
- **Mobile**: React Native, Expo
- **State Management**: Zustand, React Query
- **UI Components**: Custom components with Tailwind
- **Package Manager**: pnpm with workspaces

## 📁 Project Structure

```
├── apps/
│   ├── admin/          # Next.js admin dashboard
│   ├── api/            # NestJS API server
│   └── mobile/         # React Native mobile app
├── packages/
│   ├── shared/         # Shared types and utilities
│   ├── ui/             # Reusable UI components
│   └── eslint-config/  # ESLint configurations
└── infra/              # Infrastructure and deployment
```

## 🔧 Available Scripts

```bash
# Install dependencies
pnpm install

# Start all services in development
pnpm dev

# Build all applications
pnpm build

# Run tests
pnpm test

# Database operations
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

## 🌐 API Endpoints

- **Events**: `/api/events`
- **Guests**: `/api/events/:id/invites`
- **Messages**: `/api/events/:id/messages`
- **Schedule**: `/api/events/:id/schedule`
- **Rooms**: `/api/events/:id/rooms`

## 📝 Environment Variables

### API (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3006
RATE_LIMIT_ENABLED=false
```

### Admin (.env)
```
NEXT_PUBLIC_API_URL="http://localhost:3006"
```

## 🎯 Current Status

- ✅ Admin dashboard with full CRUD operations
- ✅ API server with comprehensive endpoints
- ✅ Mobile app with basic functionality
- ✅ Database schema and seeding
- ✅ Authentication system
- ✅ Real-time features
- ✅ Message system with drafts
- ✅ Room management
- ✅ Guest management with bulk actions
- 🔄 Testing and documentation (in progress)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Getting Help

If you need help with this project:

1. Check the issues section
2. Review the code comments
3. Contact the maintainers

## 🔧 Development Notes

### Recent Updates
- Fixed rate limiting issues (disabled for development)
- Implemented 3-tab message system (Sent, Drafts, Send Message)
- Added comprehensive error handling
- Improved API client with retry logic
- Enhanced UI components and layouts

### Known Issues
- Room API endpoints need backend implementation
- Some mobile features still in development
- Rate limiting disabled for development (should be configured for production)