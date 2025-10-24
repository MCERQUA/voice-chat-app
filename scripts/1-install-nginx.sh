#!/bin/bash
#
# Install nginx web server
# Run with: sudo bash scripts/1-install-nginx.sh
#

set -e

echo "================================"
echo "Installing nginx..."
echo "================================"

# Update package list
apt-get update

# Install nginx
apt-get install -y nginx

# Check nginx status
systemctl status nginx --no-pager || true

# Enable nginx to start on boot
systemctl enable nginx

# Start nginx
systemctl start nginx

echo ""
echo "✅ nginx installed successfully!"
echo ""
echo "nginx version:"
nginx -v

echo ""
echo "nginx is running on port 80"
echo "Test it: curl http://localhost"
