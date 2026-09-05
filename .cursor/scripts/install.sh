#!/usr/bin/env bash
set -euo pipefail

cd /workspace

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
