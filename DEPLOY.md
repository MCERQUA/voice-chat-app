# Deployment Instructions

## Deploy Latest Changes to Server

Run these commands to deploy the latest version:

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app

# Pull latest code from GitHub
git pull origin main

# Install any new dependencies
npm install

# Rebuild the app
npm run build

# Restart PM2
pm2 restart voice-chat-app

# View logs
pm2 logs voice-chat-app
```

## Quick Deploy Script

Or use this one-liner:

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app && git pull && npm install && npm run build && pm2 restart voice-chat-app
```

## Test the App

1. **Visit:** https://joshai.jamsocial.app
2. **Type a message** in the text input
3. **Press Enter** or click Send
4. **Watch Claude Code respond** directly from your server!

## What's Working Now

✅ Text chat interface
✅ Direct integration with `claude code -c`
✅ Conversation continuity (session-based)
✅ Real-time responses
✅ Error handling
✅ Loading states

🔜 Voice input/output (coming next)

## Troubleshooting

### App won't start
```bash
# Check PM2 status
pm2 status

# View errors
pm2 logs voice-chat-app --err

# Restart
pm2 restart voice-chat-app
```

### Build fails
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### Claude Code not responding
```bash
# Test claude code manually
claude code "Hello, can you help me?"

# Check if it's in PATH
which claude
```

### 502 Bad Gateway
```bash
# Check if Next.js is running on port 3000
netstat -tlnp | grep 3000

# Restart PM2
pm2 restart voice-chat-app

# Check nginx
sudo systemctl status nginx
```

## Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs voice-chat-app

# Save PM2 state
pm2 save
```

## Environment Variables

The app doesn't need environment variables for basic text chat.

For future voice integration, `.env.local` is already configured locally (not on server yet).

## Session Management

Each conversation gets a unique session ID like `session-1234567890`.

Sessions persist across page refreshes (stored in component state).

Claude Code maintains conversation history using the `-c` flag with session IDs.

## Architecture

```
Browser (https://joshai.jamsocial.app)
    ↓
nginx (reverse proxy)
    ↓
Next.js (localhost:3000)
    ↓
/api/chat route
    ↓
claude code -c "session-id" "user message"
    ↓
Response streamed back to browser
```

Simple, fast, and entirely self-contained! 🚀
