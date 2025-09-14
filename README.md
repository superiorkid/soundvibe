# SoundCloud Clone

A full-featured SoundCloud-like application built with Next.js (frontend) and NestJS (backend). Features streaming audio, playlists, social interactions and more — designed for fast development and production deployment.

> **Stack**

- **Frontend:** Next.js, TailwindCSS, shadcn-ui, TanStack Query (React Query)
- **Backend:** NestJS (Repository-Service pattern), Prisma ORM, PostgreSQL
- **Realtime / Streaming:** Audio streaming endpoints, range requests for partial content
- **UX / Features:** Infinite scroll, optimistic updates, full audio controls
- **Security & Ops:** Rate limiting, better-auth (Google & GitHub login), Swagger API docs

---

## Features

- User authentication with **Google** and **GitHub** (better-auth, integrated on frontend & backend)
- Upload and post audio files (with metadata: title, artist, cover, tags)
- Audio streaming support (byte-range requests, resume, low-latency delivery)
- Full audio player controls (play, pause, seek, volume, playback rate)
- Create, edit, and manage playlists
- Follow / unfollow users
- Repost audio tracks
- Comments and nested comments, with reactions (like/love)
- Infinite scroll for feeds and user content
- Optimistic UI updates for likes, follows, reposts, comments
- Rate-limiting on API endpoints to prevent abuse
- Swagger API documentation for backend
- Repository-Service pattern in backend for separation of concerns
- Prisma as ORM with migrations for PostgreSQL

---

## Getting Started (Development)

### Prerequisites

- Node.js >= 18
- pnpm or npm
- PostgreSQL database

### Clone

```bash
git clone <repo-url>
cd soundcloud-clone
```

### Server (backend)

1. Install dependencies

```bash
cd backend
pnpm install
```

2. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

3. Run Prisma migrations and generate client

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

4. Start development server

```bash
pnpm start:dev
```

### Client (frontend)

1. Install dependencies

```bash
cd frontend
pnpm install
```

2. Copy `.env.example` to `.env.local`

```bash
cp .env.example .env.local
```

3. Start development

```bash
pnpm dev
```

---

## Environment Variables

Example files are included:

- **Backend:** `backend/.env.example`
- **Frontend:** `frontend/.env.example`

### Backend `.env.example`

```
PORT=8000

DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>"

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:8000

FRONTEND_URL=http://localhost:3000

```

### Frontend `.env.example`

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
API_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
COOKIE_NAME=better-auth.session_token

```

---

## Architecture & Important Notes

### Backend

- Built with NestJS using a Repository-Service pattern to isolate database logic (Prisma) from business rules.
- Prisma manages schemas and migrations. Models include `User`, `Audio`, `Playlist`, `Comment`, `Reaction`, `Follow`, `Repost`, etc.
- Audio uploads are stored on disk or object storage (S3-compatible). Use a streaming endpoint that supports `Range` headers to serve partial content for seek/resume.
- Rate limiting implemented (e.g., `@nestjs/throttler` or custom middleware) using Redis to keep counters across instances.
- Swagger is exposed at `/docs` with proper API versioning.

### Frontend

- Next.js with shadcn-ui (accessible components) and Tailwind for styling.
- TanStack Query for server state and caching; optimistic updates implemented for immediate UI feedback on likes/follows/comments.
- Infinite scroll via `useInfiniteQuery` and smart cursor-based pagination from backend.
- Audio player state centralized (React context / Zustand) to allow global controls and sync across pages.

### Streaming considerations

- Serve audio through an endpoint that supports `Accept-Ranges: bytes` and honors `Range` requests.
- For large scale, offload static audio to S3 + CloudFront and use signed URLs for secure access.
- Consider HLS for adaptive streaming if you need many bitrate options.

---

## API docs

- Swagger available on the backend if enabled (`/docs`).
- Document endpoints for auth (Google/GitHub), users, audio upload/stream, playlists, comments, reactions, follows, and reposts.

---

## Database & Prisma

- Schema and example models are included in `prisma/schema.prisma`.
- Use `prisma migrate` for schema changes and `prisma studio` for local inspection.

## Scripts (examples)

**Backend**

```json
{
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "seed": "ts-node prisma/seed.ts"
}
```

**Frontend**

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Contributing

- Open an issue or PR. Follow code style and run tests.
- Branching model: `main` for production, feature branches for new work.

---

## License

MIT License
