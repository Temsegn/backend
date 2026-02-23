# Feature-by-feature commits with professional messages
# Run from repo root: powershell -ExecutionPolicy Bypass -File do-commits.ps1

Set-Location $PSScriptRoot

$count = (git rev-list --count HEAD 2>$null) -as [int]
if (-not $count) { $count = 0 }

# Unwind all but the first commit so we can re-commit by feature (changes become unstaged)
if ($count -gt 1) {
    git reset --soft "HEAD~$($count - 1)"
    git reset HEAD
}

# Now add and commit each feature with a clear message
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
$short = git status --short
if ($short) {
    git commit -m "chore: add remaining project files"
}

# Write log to file for reference
git log --oneline -25 | Set-Content -Path "commit-history.txt" -Encoding utf8
