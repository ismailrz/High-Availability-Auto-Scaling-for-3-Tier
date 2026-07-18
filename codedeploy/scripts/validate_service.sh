#!/bin/bash
set -euo pipefail

HEALTH_URL="http://localhost:3000/health"
MAX_ATTEMPTS=10
SLEEP_SECONDS=6

echo "Validating service via ${HEALTH_URL}..."

for i in $(seq 1 "${MAX_ATTEMPTS}"); do
  HTTP_STATUS=$(curl --silent --output /dev/null --write-out "%{http_code}" "${HEALTH_URL}" || echo "000")
  if [ "${HTTP_STATUS}" = "200" ]; then
    echo "Service healthy (attempt ${i}/${MAX_ATTEMPTS})."
    exit 0
  fi
  echo "Attempt ${i}/${MAX_ATTEMPTS}: got HTTP ${HTTP_STATUS}, retrying in ${SLEEP_SECONDS}s..."
  sleep "${SLEEP_SECONDS}"
done

echo "ERROR: service did not become healthy after ${MAX_ATTEMPTS} attempts." >&2
exit 1
