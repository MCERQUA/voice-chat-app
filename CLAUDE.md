# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js voice chat application with AI assistant integration. Currently in the **UI Design Complete** phase - the interface is fully functional but backend voice/AI features are not yet connected.

**Status:** UI-only implementation with mock data. No actual voice input, speech-to-text, or AI backend integration yet.

## Development Commands

### Start Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Build & Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 14 App Router with TypeScript (strict mode)
- **Styling:** Tailwind CSS with CSS variables for theming
- **UI Components:** shadcn/ui (Radix UI primitives) + custom ElevenLabs-inspired components
- **Future Integrations:** @elevenlabs/react for voice, @react-three/fiber for 3D visualization

### Path Aliases
Uses `@/*` for all imports via TypeScript path mapping:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Component Architecture

**Single-Page Application Structure:**
- `app/page.tsx` - Entry point that renders `VoiceChatInterface`
- `app/layout.tsx` - Root layout with global styles and metadata
- `components/voice-chat-interface.tsx` - Main application component (client-side)

**UI Component Categories:**

1. **ElevenLabs-Inspired Components** (custom-built):
   - `conversation.tsx` - Auto-scrolling message container
   - `message.tsx` - Message bubble with avatar support
   - `response.tsx` - Markdown-formatted AI responses
   - `live-waveform.tsx` - Animated audio visualizer (bars)
   - `orb.tsx` - Animated state indicator (idle/listening/thinking/speaking)

2. **shadcn/ui Components** (from shadcn/ui):
   - `avatar.tsx`, `button.tsx`, `card.tsx` - Standard UI primitives

### State Management (Current)

Currently uses React local state in `VoiceChatInterface`:
- `isListening: boolean` - Microphone toggle state
- `agentState: "idle" | "listening" | "thinking" | "speaking"` - Visual state for orb/UI
- `messages: ChatMessage[]` - Conversation history (hardcoded mock data)

**Note:** No actual voice/AI functionality implemented. Button clicks only toggle UI state.

## Current Limitations (UI-Only Mode)

**Not Connected:**
- ❌ Microphone access (no Web Audio API)
- ❌ Speech-to-text
- ❌ AI conversation API
- ❌ Voice synthesis
- ❌ Real-time streaming
- ❌ Message persistence

**What Works (UI):**
- ✅ Responsive layout with sidebar
- ✅ Message display with avatars
- ✅ Start/stop button with state changes
- ✅ Waveform animation toggle
- ✅ Orb color/animation based on state
- ✅ Auto-scroll to bottom in conversation

## Next Development Phase: Backend Integration

When implementing backend features, follow this sequence:

### 1. Voice Input Integration
- Implement Web Audio API for microphone access
- Connect `LiveWaveform` to actual audio levels
- Add browser permission handling
- Use either ElevenLabs API or Web Speech API for speech-to-text

### 2. AI Backend
- Set up environment variables: `NEXT_PUBLIC_ELEVENLABS_API_KEY`, `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`
- Integrate `@elevenlabs/react` SDK in `VoiceChatInterface`
- Replace mock `messages` state with real API responses
- Implement streaming response handling

### 3. State Synchronization
- Sync `agentState` with actual AI conversation status
- Connect `isListening` to real microphone state
- Update `messages` array from API transcriptions

### 4. Persistence & Error Handling
- Add conversation history storage (localStorage or database)
- Implement error boundaries
- Add loading states and retry logic
- Handle connection failures gracefully

## Code Style Guidelines

### Component Patterns
- Use `"use client"` directive for client-side interactive components
- Prefer TypeScript interfaces over types for component props
- Use Radix UI primitives for accessible interactive elements
- Follow shadcn/ui conventions for component variants

### Styling
- Use Tailwind utility classes (no custom CSS unless necessary)
- Use CSS variables from `globals.css` for theme colors
- Use `cn()` from `@/lib/utils` for conditional class merging
- Follow existing spacing/sizing patterns from shadcn/ui

### TypeScript
- Strict mode enabled (no `any` types)
- Define interfaces for all data structures (see `ChatMessage` interface)
- Use path aliases (`@/`) for all imports

## Adding New shadcn/ui Components

This project uses shadcn/ui's CLI for component management:

```bash
npx shadcn@latest add <component-name>
```

Configuration is in `components.json`:
- Style: default
- Base color: slate
- CSS variables: enabled
- Components path: `@/components/ui`

## Environment Setup (Future)

When backend integration begins, create `.env.local`:

```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

**Security:** Never commit `.env.local` to version control.

## Key Files to Understand

- `components/voice-chat-interface.tsx:20-50` - Main component state and message handling
- `components/ui/orb.tsx` - Agent state visualization logic
- `components/ui/conversation.tsx` - Auto-scroll implementation
- `app/globals.css` - Theme variables and Tailwind configuration

## Integration with Josh-AI System

This project is part of Josh's AI assistant ecosystem:
- Lives in `/home/josh/Josh-AI/projects/active/voice-chat-app/`
- Should integrate with Josh-AI knowledge base when backend is implemented
- May need to connect to Claude Code backend or ElevenLabs conversational AI
- Consider mobile-responsive deployment for voice interaction on-the-go
