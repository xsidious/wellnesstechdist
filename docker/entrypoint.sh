set -e
echo "[entrypoint] Applying schema..."
i=0
until npx prisma db push --skip-generate; do
  i=$((i + 1))
  if [ "$i" -gt 40 ]; then
    echo "[entrypoint] prisma db push failed after retries"
    exit 1
  fi
  echo "[entrypoint] DB not ready, retry $i/40..."
  sleep 2
done

echo "[entrypoint] Seeding demo users..."
npx tsx prisma/seed.ts

echo "[entrypoint] Starting Next.js on :3000"
exec node server.js
