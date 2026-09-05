#!/usr/bin/env bash
set -euo pipefail

cd /workspace

# Ensure PostgreSQL is running (idempotent)
if command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo pg_ctlcluster 16 main start 2>/dev/null || true
elif command -v service >/dev/null 2>&1; then
  sudo service postgresql start 2>/dev/null || true
fi

# Wait for Postgres to accept connections
for _ in $(seq 1 30); do
  if pg_isready -h localhost -p 5432 -q 2>/dev/null; then
    break
  fi
  sleep 1
done

exec npm run dev -- --hostname 0.0.0.0 --port 3000
