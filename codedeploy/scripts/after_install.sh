#!/bin/bash
set -euo pipefail

APP_DIR="/opt/backend"
SERVICE_NAME="backend"

echo "Installing production dependencies..."
cd "${APP_DIR}"
sudo -u ec2-user npm ci --omit=dev

echo "Writing systemd unit file..."
cat > /etc/systemd/system/${SERVICE_NAME}.service << 'UNIT'
[Unit]
Description=Backend Node.js Express API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/backend
ExecStart=/usr/bin/node /opt/backend/src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=-/opt/backend/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT

echo "Reloading systemd and enabling ${SERVICE_NAME}..."
systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"

exit 0
