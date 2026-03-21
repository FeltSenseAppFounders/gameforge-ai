#!/usr/bin/env bash
set -euo pipefail

# FeltSense Clinic — Redeploy voice agent to LiveKit Cloud
# Usage: ./scripts/deploy-agent.sh [--secrets]
#   --secrets    Also update agent secrets from agent/.env.production

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AGENT_DIR="$PROJECT_ROOT/agent"

echo "==> Deploying voice agent to LiveKit Cloud..."

# Verify lk CLI is available
if ! command -v lk &> /dev/null; then
  echo "Error: lk CLI not found. Install with: curl -sSL https://get.livekit.io/cli | bash"
  exit 1
fi

# Verify we're authenticated
if ! lk cloud auth --check 2>/dev/null; then
  echo "==> Not authenticated. Running lk cloud auth..."
  lk cloud auth
fi

# Update secrets if --secrets flag is passed
if [[ "${1:-}" == "--secrets" ]]; then
  echo "==> Updating agent secrets..."
  cd "$AGENT_DIR"
  lk agent update-secrets --secrets-file=.env.production
  echo "==> Secrets updated. Waiting for rolling restart..."
fi

# Deploy
echo "==> Building and deploying agent..."
cd "$AGENT_DIR"
lk agent deploy

echo "==> Checking agent status..."
lk agent status

echo ""
echo "Done! Monitor logs with: cd agent && lk agent logs"
