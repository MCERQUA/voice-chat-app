# Setup Scripts for joshai.jamsocial.app

## Quick Start (Recommended)

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app

# Run the automated setup (needs sudo)
sudo bash scripts/QUICK-SETUP.sh

# After it completes, setup PM2 (NO sudo)
bash scripts/5-setup-pm2.sh

# Enable auto-start on boot
pm2 startup
# (copy and run the command it outputs)
```

## Manual Step-by-Step

If you prefer to run each step manually:

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app

# 1. Install nginx
sudo bash scripts/1-install-nginx.sh

# 2. Install certbot
sudo bash scripts/2-install-certbot.sh

# 3. Configure nginx
sudo bash scripts/3-configure-nginx.sh joshai.jamsocial.app

# 4. Setup SSL (replace email if needed)
sudo bash scripts/4-setup-ssl.sh joshai.jamsocial.app josh@jamsocial.app

# 5. Setup PM2 (NO sudo!)
bash scripts/5-setup-pm2.sh

# 6. Enable auto-start
pm2 startup
```

## Prerequisites

**IMPORTANT:** Configure DNS A record first!

- **Type:** A
- **Name:** joshai
- **Domain:** jamsocial.app
- **Value:** 5.161.252.203
- **TTL:** 300

Wait 5-15 minutes for DNS propagation.

Test DNS:
```bash
dig +short joshai.jamsocial.app
# Should return: 5.161.252.203
```

## After Setup

Your voice chat app will be live at:
**https://joshai.jamsocial.app**

## Scripts Overview

| Script | Purpose | Run as |
|--------|---------|--------|
| `QUICK-SETUP.sh` | Automated setup (steps 1-4) | sudo |
| `1-install-nginx.sh` | Install nginx web server | sudo |
| `2-install-certbot.sh` | Install Let's Encrypt | sudo |
| `3-configure-nginx.sh` | Configure reverse proxy | sudo |
| `4-setup-ssl.sh` | Get SSL certificate | sudo |
| `5-setup-pm2.sh` | Build & start app | normal user |

## Troubleshooting

View detailed guide:
```bash
cat scripts/SETUP-GUIDE.md
```

## Domain Configuration

- **Domain:** joshai.jamsocial.app
- **Server IP:** 5.161.252.203
- **App Port:** 3000 (internal)
- **Public Ports:** 80 (HTTP), 443 (HTTPS)
