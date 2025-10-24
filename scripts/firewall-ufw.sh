#!/bin/bash
#
# Setup UFW firewall for voice-chat-app
# Run with: sudo bash scripts/firewall-ufw.sh
#

set -e

echo "================================"
echo "UFW Firewall Setup"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    exit 1
fi

# Check if UFW is installed
if ! command -v ufw &> /dev/null; then
    echo "Installing UFW..."
    apt-get update
    apt-get install -y ufw
fi

echo ""
echo "Current UFW status:"
ufw status verbose || true

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
echo "Configuring UFW rules..."

# Set default policies
echo "Setting default policies..."
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (CRITICAL - do this first!)
echo "✅ Allowing SSH (port 22)..."
ufw allow 22/tcp comment 'SSH access'

# Allow HTTP
echo "✅ Allowing HTTP (port 80)..."
ufw allow 80/tcp comment 'HTTP for Let's Encrypt'

# Allow HTTPS
echo "✅ Allowing HTTPS (port 443)..."
ufw allow 443/tcp comment 'HTTPS for voice chat app'

# Enable UFW
echo ""
echo "Enabling UFW..."
ufw --force enable

echo ""
echo "================================"
echo "✅ UFW Firewall Configured!"
echo "================================"
echo ""
ufw status verbose

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
