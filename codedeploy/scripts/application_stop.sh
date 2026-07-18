#!/bin/bash
set -euo pipefail

SERVICE_NAME="backend"

if systemctl list-unit-files | grep -q "^${SERVICE_NAME}.service"; then
  echo "Stopping ${SERVICE_NAME} service..."
  systemctl stop "${SERVICE_NAME}" || true
else
  echo "${SERVICE_NAME} service not yet installed, nothing to stop."
fi

exit 0
