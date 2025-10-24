#!/bin/bash
#
# Setup firewalld for voice-chat-app
# Run with: sudo bash scripts/firewall-firewalld.sh
#

set -e

echo "================================"
echo "firewalld Setup"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    exit 1
fi

# Check if firewalld is installed
if ! command -v firewall-cmd &> /dev/null; then
    echo "Installing firewalld..."
    yum install -y firewalld || dnf install -y firewalld
fi

# Start firewalld
systemctl start firewalld
systemctl enable firewalld

echo ""
echo "Current firewalld status:"
firewall-cmd --state || true

echo ""
echo "⚠️  IMPORTANT: This will configure the firewall."
echo "Ports to be opened:"
echo "  - 22/tcp  (SSH) - Server management"
echo "  - 80/tcp  (HTTP) - Let's Encrypt + HTTPS redirect"
echo "  - 443/tcp (HTTPS) - Main application"
echo ""
echo "Port 3000 will NOT be opened (Next.js is internal only)"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "Configuring firewalld rules..."

# Add services
echo "✅ Allowing SSH..."
firewall-cmd --permanent --add-service=ssh

echo "✅ Allowing HTTP..."
firewall-cmd --permanent --add-service=http

echo "✅ Allowing HTTPS..."
firewall-cmd --permanent --add-service=https

# Reload firewalld
echo ""
echo "Reloading firewalld..."
firewall-cmd --reload

echo ""
echo "================================"
echo "✅ firewalld Configured!"
echo "================================"
echo ""
firewall-cmd --list-all

echo ""
echo "Allowed services:"
echo "  ✅ SSH (22/tcp) - Server access"
echo "  ✅ HTTP (80/tcp) - SSL validation"
echo "  ✅ HTTPS (443/tcp) - Voice chat app"
echo ""
echo "Protected services:"
echo "  🔒 Port 3000 (Next.js) - Localhost only"
echo "  🔒 All other ports - Blocked"
echo ""
echo "Your app is now accessible at:"
echo "  https://joshai.jamsocial.app"
