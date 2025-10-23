#!/bin/bash
#
# Setup PM2 to run voice-chat-app
# Run as normal user (NOT sudo): bash scripts/5-setup-pm2.sh
#

set -e

APP_DIR="/home/josh/Josh-AI/projects/active/voice-chat-app"
APP_NAME="voice-chat-app"

echo "================================"
echo "Setting up PM2 for voice-chat-app"
echo "================================"

cd $APP_DIR

# Build the Next.js app
echo "Building Next.js app..."
npm run build

# Stop existing PM2 process if running
pm2 delete $APP_NAME 2>/dev/null || true

# Start with PM2
echo "Starting app with PM2..."
pm2 start npm --name $APP_NAME -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot (run this once)
echo ""
echo "To enable auto-start on server reboot, run:"
echo "pm2 startup"
echo "(Then copy and run the command it outputs)"

echo ""
echo "✅ PM2 setup complete!"
echo ""
pm2 status
echo ""
echo "Useful PM2 commands:"
echo "  pm2 logs $APP_NAME      # View logs"
echo "  pm2 restart $APP_NAME   # Restart app"
echo "  pm2 stop $APP_NAME      # Stop app"
echo "  pm2 monit               # Monitor in real-time"
