#!/bin/bash
set -euo pipefail

APP_DIR="/opt/backend"

echo "Ensuring Node.js is installed..."
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js not found on this instance/AMI. Install Node.js on the AMI before deploying." >&2
  exit 1
fi
node -v
npm -v

echo "Preparing ${APP_DIR}..."
mkdir -p "${APP_DIR}"

# Remove old app code but keep the directory itself (owned correctly).
find "${APP_DIR}" -mindepth 1 -delete || true

chown -R ec2-user:ec2-user "${APP_DIR}"

exit 0
