# Enout App Monorepo

## Dev Quickstart

```bash
# Install dependencies
pnpm install

# Start all apps in parallel
pnpm dev

# Access the applications:
# - Admin: http://localhost:3000
# - API: http://localhost:3001/health
# - Mobile: Expo interface will open automatically
```

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter @enout/admin dev  # Admin app (http://localhost:3000)
pnpm --filter @enout/api dev    # API (http://localhost:3001)
pnpm --filter @enout/mobile dev  # Mobile app (Expo)
```

### Build

```bash
pnpm build
```

### Lint and Typecheck

```bash
pnpm lint
pnpm typecheck
```

### Local DB/Redis

The project uses PostgreSQL and Redis for local development. You can start these services using Docker Compose:

```bash
# Start PostgreSQL and Redis
docker compose -f infra/docker/docker-compose.dev.yml up -d

# Check services status
docker compose -f infra/docker/docker-compose.dev.yml ps

# Stop services
docker compose -f infra/docker/docker-compose.dev.yml down
```

### Database Setup

**Important**: You must create a .env file before running any database operations.

```bash
# Create a .env file from the example (required)
cp .env.example .env

# Prisma requires .env file next to the schema
cp infra/prisma/.env.example infra/prisma/.env

# Generate Prisma client
pnpm --filter @enout/api prisma:generate

# Run migrations
pnpm --filter @enout/api prisma:migrate

# Seed the database
pnpm --filter @enout/api db:seed
```
