#!/bin/bash
#
# Install certbot for Let's Encrypt SSL certificates
# Run with: sudo bash scripts/2-install-certbot.sh
#

set -e

echo "================================"
echo "Installing certbot..."
echo "================================"

# Update package list
apt-get update

# Install certbot and nginx plugin
apt-get install -y certbot python3-certbot-nginx

echo ""
echo "✅ certbot installed successfully!"
echo ""
echo "certbot version:"
certbot --version

echo ""
echo "Next step: Configure your domain DNS A record to point to this server IP"
echo "Server IP: $(curl -s ifconfig.me)"
