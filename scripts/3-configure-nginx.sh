#!/bin/bash
#
# Configure nginx reverse proxy for voice-chat-app
# Run with: sudo bash scripts/3-configure-nginx.sh your.domain.com
#

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: sudo bash scripts/3-configure-nginx.sh your.domain.com"
    echo "Example: sudo bash scripts/3-configure-nginx.sh voice.josh-ai.com"
    exit 1
fi

DOMAIN=$1
APP_PORT=3000

echo "================================"
echo "Configuring nginx for: $DOMAIN"
echo "Proxying to: localhost:$APP_PORT"
echo "================================"

# Create nginx config
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Increase timeouts for long-running requests (claude code sessions)
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo ""
echo "✅ nginx configured successfully!"
echo ""
echo "Domain: $DOMAIN"
echo "Proxy: localhost:$APP_PORT"
echo ""
echo "Next steps:"
echo "1. Make sure DNS A record points to this server"
echo "2. Make sure Next.js is running on port $APP_PORT"
echo "3. Run SSL setup: sudo bash scripts/4-setup-ssl.sh $DOMAIN"
