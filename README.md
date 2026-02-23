# News API

A production-ready RESTful API where **Authors** publish content and **Readers** consume it. Includes an **Analytics Engine** that records engagement and aggregates daily view counts (GMT).

## Tech Stack

- **Runtime:** Node.js (>= 18)
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (24h expiry), BCrypt for passwords
- **Validation:** express-validator
- **Jobs:** node-cron (daily analytics at 00:05 GMT)

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `3000`) |
| `DATABASE_URL` | MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`) |
| `JWT_SECRET` | Secret for signing JWTs (use a long random string in production) |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `24h`) |
| `READ_DEDUP_WINDOW_MINUTES` | Optional; same reader+article within this window = one read (default `15`) |

### Run locally

```bash
# Development (watch mode)
npm run dev

# Build and production
npm run build
npm start
```

### Test

```bash
npm test
```

Unit tests mock the database and cover auth and article endpoints.

## API Overview

### Response format

- **Success:** `{ "Success": true, "Message": string, "Object": data, "Errors": null }`
- **Paginated:** same plus `PageNumber`, `PageSize`, `TotalSize`
- **Error:** `{ "Success": false, "Message": string, "Object": null, "Errors": string[] }`

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | No | Register (Name, Email, Password, Role). Strong password + unique email. |
| POST | `/api/auth/login` | No | Login → JWT (`sub`, `role`) |
| GET | `/api/articles` | No | Public feed: published, not deleted. Query: `category`, `author`, `q`, `page`, `size` |
| GET | `/api/articles/:id` | Optional | Article by id; creates ReadLog (guest or ReaderId from JWT) |
| POST | `/api/articles` | Author | Create article |
| GET | `/api/articles/me` | Author | My articles (paginated; `includeDeleted=true` optional) |
| PUT | `/api/articles/:id` | Author | Update own article |
| DELETE | `/api/articles/:id` | Author | Soft-delete own article |
| GET | `/api/author/dashboard` | Author | Paginated list with Title, CreatedAt, TotalViews |

**Auth header:** `Authorization: Bearer <token>`

### Preventing read spam

Same user (or same guest) refreshing the same article repeatedly is limited by **read deduplication**: within `READ_DEDUP_WINDOW_MINUTES` (default 15), only one ReadLog per article per reader (or per guest) is stored. Further hits in that window do not create new logs.

## Project structure

```
src/
├── config/         # database, environment
├── entities/       # Mongoose models (User, Article, ReadLog, DailyAnalytics)
├── repositories/   # Data access
├── services/       # Business logic (auth, article, readTracking, analytics)
├── controllers/    # HTTP handlers
├── middleware/     # auth, validation, errorHandler, rateLimiter, security
├── validators/     # express-validator chains
├── jobs/           # Daily analytics cron (GMT)
├── routes/         # Route definitions
├── utils/          # response helpers, logger, constants
├── types/          # Request/auth types
├── app.ts          # Express app (used by server and tests)
└── server.ts       # DB connect, cron start, listen
tests/
├── unit/           # HTTP tests with mocked DB
```

## License

MIT
