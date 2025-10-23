# Voice Chat App Server Setup Guide

Complete setup guide for hosting the voice-chat-app on your server with nginx, SSL, and PM2.

## Prerequisites

✅ **Already Installed:**
- Node.js v20.19.5
- npm 10.8.2
- PM2 (process manager)

❌ **Need to Install:**
- nginx (web server)
- certbot (SSL certificates)

## Setup Steps

### Step 1: Install nginx

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app
sudo bash scripts/1-install-nginx.sh
```

This will:
- Install nginx web server
- Enable it to start on boot
- Start the nginx service

### Step 2: Install certbot (Let's Encrypt)

```bash
sudo bash scripts/2-install-certbot.sh
```

This will:
- Install certbot and nginx plugin
- Display your server IP address

### Step 3: Configure DNS

**IMPORTANT:** Before continuing, configure your domain's DNS A record:

1. Go to your domain registrar (GoDaddy, Cloudflare, etc.)
2. Create an A record:
   - **Name:** `voice` (or whatever subdomain you want)
   - **Type:** A
   - **Value:** `5.161.252.203` (your server IP)
   - **TTL:** 300 (or automatic)

3. Wait for DNS propagation (usually 5-15 minutes)

4. Test DNS:
   ```bash
   dig +short voice.yourdomain.com
   # Should return: 5.161.252.203
   ```

### Step 4: Configure nginx

```bash
sudo bash scripts/3-configure-nginx.sh voice.yourdomain.com
```

Replace `voice.yourdomain.com` with your actual domain.

This will:
- Create nginx reverse proxy configuration
- Proxy requests to Next.js (port 3000)
- Set security headers
- Enable long timeouts for Claude Code sessions

### Step 5: Setup SSL Certificate

```bash
sudo bash scripts/4-setup-ssl.sh voice.yourdomain.com your@email.com
```

Replace with your actual domain and email.

This will:
- Verify DNS is pointing to server
- Request SSL certificate from Let's Encrypt
- Configure automatic HTTPS redirect
- Setup auto-renewal

### Step 6: Setup PM2

```bash
bash scripts/5-setup-pm2.sh
```

**Note:** Run this as normal user (NOT sudo)

This will:
- Build the Next.js production app
- Start app with PM2 on port 3000
- Save PM2 process list

### Step 7: Enable PM2 Auto-Start

```bash
pm2 startup
```

This will output a command like:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u josh --hp /home/josh
```

Copy and run that command to enable auto-start on server reboot.

## Verification

### Check Services

```bash
# Check nginx
sudo systemctl status nginx

# Check PM2
pm2 status

# Check app logs
pm2 logs voice-chat-app

# Check SSL certificate
sudo certbot certificates
```

### Test the App

1. **HTTP (should redirect to HTTPS):**
   ```bash
   curl -I http://voice.yourdomain.com
   ```

2. **HTTPS:**
   ```bash
   curl https://voice.yourdomain.com
   ```

3. **Open in browser:**
   - Visit: `https://voice.yourdomain.com`
   - Should see the dark-themed voice chat interface

## Troubleshooting

### nginx won't start
```bash
sudo nginx -t              # Test configuration
sudo systemctl status nginx # Check status
sudo journalctl -u nginx   # View logs
```

### PM2 app not running
```bash
pm2 logs voice-chat-app    # View logs
pm2 restart voice-chat-app # Restart
cd /home/josh/Josh-AI/projects/active/voice-chat-app
npm run build              # Rebuild if needed
```

### SSL certificate fails
- Make sure DNS A record is correct
- Wait 15 minutes for DNS propagation
- Check: `dig +short voice.yourdomain.com`
- Verify port 80 is open: `sudo netstat -tlnp | grep :80`

### Port 3000 already in use
```bash
sudo lsof -i :3000         # See what's using port 3000
pm2 delete voice-chat-app  # Stop the app
pm2 start ...              # Restart
```

## File Locations

- **nginx config:** `/etc/nginx/sites-available/voice.yourdomain.com`
- **SSL certificates:** `/etc/letsencrypt/live/voice.yourdomain.com/`
- **App directory:** `/home/josh/Josh-AI/projects/active/voice-chat-app`
- **PM2 logs:** `~/.pm2/logs/`

## Maintenance

### Update the App

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app
git pull origin main       # Get latest code
npm install                # Update dependencies
npm run build              # Rebuild
pm2 restart voice-chat-app # Restart app
```

### Renew SSL Certificate

Automatic renewal is configured via systemd timer.

Test renewal:
```bash
sudo certbot renew --dry-run
```

Force renewal:
```bash
sudo certbot renew --force-renewal
```

### Monitor App

```bash
pm2 monit                  # Real-time monitoring
pm2 logs voice-chat-app    # View logs
pm2 status                 # Process status
```

## Quick Start (All-in-One)

If your DNS is already configured:

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app

# Install dependencies (run as sudo)
sudo bash scripts/1-install-nginx.sh
sudo bash scripts/2-install-certbot.sh
sudo bash scripts/3-configure-nginx.sh voice.yourdomain.com
sudo bash scripts/4-setup-ssl.sh voice.yourdomain.com your@email.com

# Setup app (run as normal user)
bash scripts/5-setup-pm2.sh

# Enable auto-start
pm2 startup
# (copy and run the command it outputs)
```

## Next Steps

Once everything is running:
1. Visit your domain: `https://voice.yourdomain.com`
2. Test the voice chat interface
3. Implement the `/api/chat` route to connect to Claude Code
4. Start having conversations with your AI assistant!

---

**Server IP:** 5.161.252.203
**App Directory:** /home/josh/Josh-AI/projects/active/voice-chat-app
**PM2 Process:** voice-chat-app
**Port:** 3000 (internal), 80/443 (external)
