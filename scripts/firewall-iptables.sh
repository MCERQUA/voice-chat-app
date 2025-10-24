#!/bin/bash
#
# Setup iptables firewall for voice-chat-app
# Run with: sudo bash scripts/firewall-iptables.sh
#

set -e

echo "================================"
echo "iptables Firewall Setup"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    exit 1
fi

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
echo "Configuring iptables rules..."

# Flush existing rules
echo "Flushing existing rules..."
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Set default policies
echo "Setting default policies..."
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
echo "✅ Allowing loopback..."
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
echo "✅ Allowing established connections..."
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH
echo "✅ Allowing SSH (port 22)..."
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP
echo "✅ Allowing HTTP (port 80)..."
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Allow HTTPS
echo "✅ Allowing HTTPS (port 443)..."
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Install iptables-persistent to save rules
echo ""
echo "Installing iptables-persistent..."
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent

# Save rules
echo "Saving iptables rules..."
iptables-save > /etc/iptables/rules.v4

echo ""
echo "================================"
echo "✅ iptables Firewall Configured!"
echo "================================"
echo ""
echo "Current rules:"
iptables -L -v -n

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
echo ""
echo "Rules saved to: /etc/iptables/rules.v4"
echo "Rules will persist across reboots"
