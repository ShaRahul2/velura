#!/usr/bin/env bash
set -euo pipefail

cd /workspace

# Start PostgreSQL and ensure local dev database exists (idempotent)
if command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo pg_ctlcluster 16 main start 2>/dev/null || true
elif command -v service >/dev/null 2>&1; then
  sudo service postgresql start 2>/dev/null || true
fi

for _ in $(seq 1 30); do
  if pg_isready -h localhost -p 5432 -q 2>/dev/null; then
    break
  fi
  sleep 1
done

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='velura'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE USER velura WITH PASSWORD 'velura_dev' CREATEDB;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='velura'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE velura OWNER velura;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE velura TO velura;" 2>/dev/null || true

# Local dev defaults — override via Cloud Agent secrets if needed
if [[ ! -f .env.local ]]; then
  cat > .env.local <<'EOF'
DATABASE_URL="postgresql://velura:velura_dev@localhost:5432/velura"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="local-dev-auth-secret-change-in-production"
ADMIN_EMAIL="admin@velura.local"
ADMIN_PASSWORD="velura-admin-dev"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
EOF
fi

npm ci
npx prisma generate
npm run db:push
npm run db:seed
