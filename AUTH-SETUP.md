# Authentication Setup

## Current Configuration

**Password:** `JAM2000$` (stored in `.env.local`)

## How It Works

1. **Login Page:** Users see a login screen at https://joshai.jamsocial.app
2. **Enter Password:** Type `JAM2000$` and press Enter or click Login
3. **Access Granted:** Chat interface appears with full autonomous AI access
4. **Logout:** Click logout icon in header to return to login screen

## Session Management

- Authentication stored in browser's `sessionStorage`
- Persists across page refreshes
- Cleared when browser tab closes
- Cleared on manual logout

## Security

### Current (Simple Password)
- ✅ Single password authentication
- ✅ Protects from unauthorized access
- ✅ Accessible from anywhere with password
- ⚠️ Password visible in .env.local (server-side only)
- ⚠️ No rate limiting yet
- ⚠️ No multi-user support

### Future (Clerk Integration)
- 🔜 OAuth login (Google, GitHub, etc.)
- 🔜 Multi-user support
- 🔜 Role-based access
- 🔜 Session management
- 🔜 Activity logging

## File Structure

```
.env.local (NOT in git)
  └── AUTH_PASSWORD=JAM2000$

app/api/auth/login/route.ts
  └── Password verification endpoint

components/login.tsx
  └── Login form component

app/page.tsx
  └── Auth wrapper (login → chat)
```

## Deployment Notes

### On Production Server

The `.env.local` file exists at:
```
/home/josh/Josh-AI/projects/active/voice-chat-app/.env.local
```

It contains:
```bash
AUTH_PASSWORD=JAM2000$
```

This file is **NOT** in git (protected by `.gitignore`).

### When Deploying Updates

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app

# Pull latest code (won't affect .env.local)
git pull origin main

# Install/update dependencies
npm install

# Rebuild
npm run build

# Restart with updated environment
pm2 restart voice-chat-app --update-env
```

The `.env.local` file will remain intact with your password.

### Setting Up on New Server

If deploying to a new server:

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Set `AUTH_PASSWORD=JAM2000$` in `.env.local`
4. Run the deployment scripts

## Changing the Password

To change the password:

1. Edit `.env.local` on the server
2. Change `AUTH_PASSWORD` value
3. Restart PM2: `pm2 restart voice-chat-app --update-env`
4. New password takes effect immediately

## Testing

Test authentication endpoint:
```bash
# Wrong password (should fail)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}'

# Correct password (should succeed)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"JAM2000$"}'
```

## Access Control

Who can access:
- ✅ Anyone with the password (from anywhere)
- ✅ No IP restrictions
- ✅ No geographic restrictions
- ✅ Works on any device/browser

Protection level:
- 🔒 Prevents unauthorized access to autonomous AI
- 🔒 Protects Josh-AI system from abuse
- 🔒 Session-based (logout clears access)

## Future Enhancements

When integrating Clerk:
1. Remove simple password system
2. Add Clerk authentication provider
3. Use Clerk session management
4. Add user roles (admin, viewer, etc.)
5. Integrate with other jamsocial.app domains

---

**Current Status:** ✅ Password authentication active
**Password:** `JAM2000$`
**Access:** https://joshai.jamsocial.app
**Next:** Clerk integration (when ready)
