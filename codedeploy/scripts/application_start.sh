#!/bin/bash
set -euo pipefail

SERVICE_NAME="backend"

echo "Starting ${SERVICE_NAME} service..."
systemctl start "${SERVICE_NAME}"

exit 0
