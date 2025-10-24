# Slash Commands

## Auto-Run Commands

### /josh-intro

**Location:** `~/.claude/commands/josh-intro.md`
**Runs:** Automatically on login
**Purpose:** Comprehensive system status greeting

This command runs automatically when Josh logs into the voice chat interface. It provides:

#### System Health Report
- Server uptime and resources
- Disk space and memory usage
- PM2 processes status
- Load average

#### Domain Portfolio Status
- Total domains (765+)
- Domains expiring soon
- Recent changes
- Portfolio value ($38k-$191k)

#### Active Projects
- Current work in `/home/josh/Josh-AI/projects/active/`
- Recent git commits
- Project status

#### Recent Activity
- Git commits across Josh-AI (last 7 days)
- Tool usage
- System changes

#### Alerts & Reminders
- Expiring domains
- Server issues
- Pending tasks
- Important notifications

### Example Output

```
Good morning, Josh! 👋

Here's your Josh-AI system status:

## 🖥️ System Health
✅ Server uptime: 15 days, 3 hours
✅ Disk: 45% used (28GB free)
✅ Memory: 62% used
✅ All services running smoothly

## 📊 Domain Portfolio
• Total domains: 765
• Estimated value: $38k-$191k
• Expiring in 30 days: 3 domains
  - example1.com (expires Jan 15)
  - example2.com (expires Jan 20)

## 🚀 Active Projects
• voice-chat-app - Latest: "Add authentication" (2 hours ago)
• domain-portfolio - Ready for deployment

## 📈 Recent Activity
• 15 commits in last 7 days
• voice-chat-app deployed to joshai.jamsocial.app

Everything is running smoothly! How can I assist you today?
```

## How It Works

1. **User logs in** with password (`JAM2000$`)
2. **Login successful** → `isFirstLogin` flag set to `true`
3. **VoiceChatInterface** detects first login
4. **Auto-sends** `/josh-intro` command
5. **Status appears** as first message in chat
6. **User ready** to interact with full context

## Command File Location

The `/josh-intro` command is defined at:
```
~/.claude/commands/josh-intro.md
```

This is a global Claude Code slash command available to all sessions.

## Creating New Commands

To create additional slash commands:

1. Create a markdown file in `~/.claude/commands/`
2. Add YAML frontmatter with description
3. Write the command prompt/instructions
4. Command becomes available as `/command-name`

Example:
```bash
# Create new command
cat > ~/.claude/commands/my-command.md << 'EOF'
---
description: "My custom command description"
---

Instructions for what this command should do...
EOF
```

## Future Commands

Potential commands to add:
- `/domain-check [domain]` - Quick domain availability lookup
- `/server-health` - Detailed server diagnostics
- `/backup-status` - Check backup health
- `/deploy-status` - Check all deployed services
- `/security-audit` - Run security checks

## Integration Points

The auto-run system is implemented in:
- `app/page.tsx` - Tracks `isFirstLogin` state
- `components/voice-chat-interface.tsx` - `sendAutoMessage()` function
- `app/api/chat/route.ts` - Executes command via Claude Code

## Customizing the Greeting

To customize what appears on login, edit:
```bash
~/.claude/commands/josh-intro.md
```

Changes take effect immediately on next login.

## Disabling Auto-Run

To disable the automatic greeting, comment out this code in `voice-chat-interface.tsx`:

```typescript
// Auto-run /josh-intro on first login
React.useEffect(() => {
  if (isFirstLogin && messages.length === 0) {
    // Send the /josh-intro command automatically
    sendAutoMessage("/josh-intro")
  }
}, [isFirstLogin])
```

## Manual Invocation

Users can also manually run the command by typing:
```
/josh-intro
```

This will regenerate the status report at any time.

---

**Status:** ✅ Active
**Command:** `/josh-intro`
**Auto-runs:** On every fresh login
**Customizable:** Yes (edit ~/.claude/commands/josh-intro.md)
