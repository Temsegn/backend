# Intended commit history (feature-by-feature)

## Run in your terminal (from project root)

Open **PowerShell** or **Command Prompt**, go to the project folder, then run:

```powershell
cd d:\backend
powershell -ExecutionPolicy Bypass -File do-commits.ps1
```

Or in **cmd**:

```cmd
cd /d d:\backend
powershell -ExecutionPolicy Bypass -File do-commits.ps1
```

This will:
1. Soft-reset so all changes are re-applied (keeps first commit if any).
2. Commit each feature separately with the messages below.
3. Write `commit-history.txt` with the final `git log --oneline`.

Or run these in order (from repo root):

```bash
git add src/config/ .env.example .gitignore
git commit -m "chore: add config (database, environment) and .env.example"

git add src/utils/ src/types/
git commit -m "feat: add utils (response, logger, constants, helpers) and types"

git add src/entities/
git commit -m "feat: add entities (User, Article, ReadLog, DailyAnalytics)"

git add src/repositories/
git commit -m "feat: add repositories (user, article, readLog, analytics)"

git add src/validators/
git commit -m "feat: add centralized validators (auth, article)"

git add src/middleware/
git commit -m "feat: add middleware (auth, RBAC, validation, errorHandler, rateLimiter, security)"

git add src/services/
git commit -m "feat: add services (auth, article, readTracking, analytics)"

git add src/controllers/
git commit -m "feat: add controllers (auth, article, author dashboard)"

git add src/jobs/
git commit -m "feat: add daily analytics cron job (GMT aggregation)"

git add src/routes/ src/app.ts src/server.ts
git commit -m "feat: add routes and app entry (Express app + server)"

git add jest.config.js tests/ package.json package-lock.json tsconfig.json
git commit -m "test: add unit tests and Jest config (mocked DB)"

git add README.md
git commit -m "docs: add README with setup, env vars, and API overview"

git add .
git commit -m "chore: add remaining project files"
```

## Expected log (oldest first)

| # | Commit message |
|---|----------------|
| 1 | chore: add config (database, environment) and .env.example |
| 2 | feat: add utils (response, logger, constants, helpers) and types |
| 3 | feat: add entities (User, Article, ReadLog, DailyAnalytics) |
| 4 | feat: add repositories (user, article, readLog, analytics) |
| 5 | feat: add centralized validators (auth, article) |
| 6 | feat: add middleware (auth, RBAC, validation, errorHandler, rateLimiter, security) |
| 7 | feat: add services (auth, article, readTracking, analytics) |
| 8 | feat: add controllers (auth, article, author dashboard) |
| 9 | feat: add daily analytics cron job (GMT aggregation) |
| 10 | feat: add routes and app entry (Express app + server) |
| 11 | test: add unit tests and Jest config (mocked DB) |
| 12 | docs: add README with setup, env vars, and API overview |
| 13 | chore: add remaining project files (if any) |

After running, verify with: `git log --oneline`
