#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS_DIR="$ROOT_DIR/scripts"

echo "Generating dev certs (mkcert)..."
if command -v pwsh >/dev/null 2>&1; then
  pwsh -NoProfile -ExecutionPolicy Bypass -File "$SCRIPTS_DIR/generate-dev-certs.ps1"
else
  # Try to run mkcert directly
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "mkcert not found. Install mkcert or run the PowerShell script with PowerShell Core."
    exit 1
  fi
  mkcert -install || true
  mkdir -p "$ROOT_DIR/caddy/ssl"
  mkcert -cert-file "$ROOT_DIR/caddy/ssl/localhost.pem" -key-file "$ROOT_DIR/caddy/ssl/localhost-key.pem" "localhost" "127.0.0.1" "api.local"
fi

echo "Starting docker compose (build + detached)..."
pushd "$ROOT_DIR/docker" >/dev/null
docker compose up --build -d
popd >/dev/null

echo "Done. Use 'docker compose logs -f caddy' in the docker folder to follow logs."
