#!/bin/bash
#
# Setup Let's Encrypt SSL certificate
# Run with: sudo bash scripts/4-setup-ssl.sh your.domain.com your@email.com
#

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Error: Domain and email required"
    echo "Usage: sudo bash scripts/4-setup-ssl.sh your.domain.com your@email.com"
    echo "Example: sudo bash scripts/4-setup-ssl.sh voice.josh-ai.com josh@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

echo "================================"
echo "Setting up SSL for: $DOMAIN"
echo "Email: $EMAIL"
echo "================================"

# Check if DNS is pointing to this server
echo "Checking DNS..."
SERVER_IP_V4=$(curl -s -4 ifconfig.me 2>/dev/null || echo "")
SERVER_IP_V6=$(curl -s -6 ifconfig.me 2>/dev/null || echo "")
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [ -n "$SERVER_IP_V4" ]; then
    echo "Server IPv4: $SERVER_IP_V4"
fi
if [ -n "$SERVER_IP_V6" ]; then
    echo "Server IPv6: $SERVER_IP_V6"
fi
echo "Domain resolves to: $DOMAIN_IP"

# Check if domain matches either IPv4 or IPv6
if [ "$DOMAIN_IP" = "$SERVER_IP_V4" ] || [ "$DOMAIN_IP" = "$SERVER_IP_V6" ]; then
    echo "✅ DNS is configured correctly!"
else
    echo ""
    echo "⚠️  Warning: DNS may not be configured correctly"
    echo "Make sure your domain's A record points to one of:"
    if [ -n "$SERVER_IP_V4" ]; then
        echo "  IPv4: $SERVER_IP_V4"
    fi
    if [ -n "$SERVER_IP_V6" ]; then
        echo "  IPv6: $SERVER_IP_V6"
    fi
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get SSL certificate
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL

echo ""
echo "✅ SSL certificate installed successfully!"
echo ""
echo "Your site is now available at: https://$DOMAIN"
echo ""
echo "Certificate will auto-renew via systemd timer"
echo "Check renewal status: sudo certbot renew --dry-run"
