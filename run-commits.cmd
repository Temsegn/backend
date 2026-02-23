@echo off
cd /d d:\backend
echo Running feature commits... > commit-log.txt
echo. >> commit-log.txt

git add src/config/ .env.example .gitignore
git commit -m "chore: add config (database, environment) and .env.example"
echo step 1 >> commit-log.txt

git add src/utils/ src/types/
git commit -m "feat: add utils (response, logger, constants, helpers) and types"
echo step 2 >> commit-log.txt

git add src/entities/
git commit -m "feat: add entities (User, Article, ReadLog, DailyAnalytics)"
echo step 3 >> commit-log.txt

git add src/repositories/
git commit -m "feat: add repositories (user, article, readLog, analytics)"
echo step 4 >> commit-log.txt

git add src/validators/
git commit -m "feat: add centralized validators (auth, article)"
echo step 5 >> commit-log.txt

git add src/middleware/
git commit -m "feat: add middleware (auth, RBAC, validation, errorHandler, rateLimiter, security)"
echo step 6 >> commit-log.txt

git add src/services/
git commit -m "feat: add services (auth, article, readTracking, analytics)"
echo step 7 >> commit-log.txt

git add src/controllers/
git commit -m "feat: add controllers (auth, article, author dashboard)"
echo step 8 >> commit-log.txt

git add src/jobs/
git commit -m "feat: add daily analytics cron job (GMT aggregation)"
echo step 9 >> commit-log.txt

git add src/routes/ src/app.ts src/server.ts
git commit -m "feat: add routes and app entry (Express app + server)"
echo step 10 >> commit-log.txt

git add jest.config.js tests/ package.json package-lock.json tsconfig.json
git commit -m "test: add unit tests and Jest config (mocked DB)"
echo step 11 >> commit-log.txt

git add README.md
git commit -m "docs: add README with setup, env vars, and API overview"
echo step 12 >> commit-log.txt

git add .
git status --short
git commit -m "chore: add remaining project files" 2>nul || echo no more files
echo. >> commit-log.txt
echo Final log: >> commit-log.txt
git log --oneline -20 >> commit-log.txt
