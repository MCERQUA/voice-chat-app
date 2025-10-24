# Slash Commands for Voice Chat App

This directory contains backup copies of Claude Code slash commands used by the voice chat interface.

## Active Commands

### josh-intro.md

**Status:** ✅ Active
**Location:** `~/.claude/commands/josh-intro.md`
**Runs:** Automatically on login

Provides comprehensive system status report including:
- Server health
- Domain portfolio status
- Active projects
- Recent activity
- Alerts and reminders

## Installation

To install these commands on a new server:

```bash
# Copy commands to Claude Code's commands directory
cp slash-commands/*.md ~/.claude/commands/

# Or use symlinks to keep them synced
ln -s $(pwd)/slash-commands/*.md ~/.claude/commands/
```

## Maintenance

When updating commands:

1. Edit the active command in `~/.claude/commands/`
2. Copy changes back to this directory:
   ```bash
   cp ~/.claude/commands/josh-intro.md slash-commands/
   git add slash-commands/josh-intro.md
   git commit -m "Update josh-intro command"
   ```

This keeps the project's backup in sync with the active command.

## Command Structure

All slash commands follow this format:

```markdown
---
description: "Brief description of what the command does"
---

Detailed instructions and prompt for Claude Code...
```

## See Also

- [SLASH-COMMANDS.md](../SLASH-COMMANDS.md) - Full documentation
- [Claude Code Slash Commands Docs](https://docs.claude.com/en/docs/claude-code/slash-commands)
