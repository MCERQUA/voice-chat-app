#!/bin/bash
#
# Quick Setup for joshai.jamsocial.app
# This script will guide you through the entire setup process
#

DOMAIN="joshai.jamsocial.app"
EMAIL="josh@jamsocial.app"  # Change this if needed
APP_DIR="/home/josh/Josh-AI/projects/active/voice-chat-app"

echo "================================"
echo "Voice Chat App Setup"
echo "================================"
echo "Domain: $DOMAIN"
echo "Server IP: $(curl -s ifconfig.me)"
echo "App Directory: $APP_DIR"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    echo "Run: sudo bash scripts/QUICK-SETUP.sh"
    exit 1
fi

cd $APP_DIR

echo "Step 1/4: Installing nginx..."
bash scripts/1-install-nginx.sh

echo ""
echo "Step 2/4: Installing certbot..."
bash scripts/2-install-certbot.sh

echo ""
echo "Step 3/4: Configuring nginx for $DOMAIN..."
bash scripts/3-configure-nginx.sh $DOMAIN

echo ""
echo "Checking DNS configuration..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo "Server IP: $SERVER_IP"
echo "Domain resolves to: $DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo ""
    echo "⚠️  DNS NOT CONFIGURED!"
    echo ""
    echo "Please configure your DNS A record:"
    echo "  Type: A"
    echo "  Name: joshai"
    echo "  Value: $SERVER_IP"
    echo "  TTL: 300"
    echo ""
    echo "After DNS is configured, run SSL setup:"
    echo "  sudo bash scripts/4-setup-ssl.sh $DOMAIN $EMAIL"
    echo ""
    echo "Then setup PM2 as normal user:"
    echo "  bash scripts/5-setup-pm2.sh"
    exit 0
fi

echo ""
echo "✅ DNS is configured correctly!"
echo ""
echo "Step 4/4: Setting up SSL certificate..."
bash scripts/4-setup-ssl.sh $DOMAIN $EMAIL

echo ""
echo "================================"
echo "✅ SERVER SETUP COMPLETE!"
echo "================================"
echo ""
echo "Next step (run as normal user, NOT sudo):"
echo "  bash scripts/5-setup-pm2.sh"
echo ""
echo "Then enable auto-start:"
echo "  pm2 startup"
echo "  (copy and run the command it outputs)"
echo ""
echo "Your app will be live at: https://$DOMAIN"
