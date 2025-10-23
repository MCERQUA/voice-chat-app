# Voice Chat App

AI-powered voice chat application with real-time transcription, built with Next.js and ElevenLabs UI components.

## Project Status

**Phase:** UI Design Complete ✅
**Next Phase:** Backend Integration (Planned)

---

## Overview

This is a voice-enabled chat application that allows users to have conversations with an AI assistant. The interface displays live transcriptions of both user speech and AI responses, with visual feedback through waveform visualization and an animated orb.

### Key Features

- **Voice Input**: Real-time voice capture with visual waveform feedback
- **Live Transcription**: Display of conversation history with both user and AI messages
- **Visual Feedback**: Animated orb showing agent state (idle, listening, thinking, speaking)
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Built with shadcn/ui and ElevenLabs UI components

---

## Design Architecture

### Component Structure

```
app/
├── layout.tsx          # Root layout with global styles
├── page.tsx            # Main page rendering VoiceChatInterface
└── globals.css         # Tailwind CSS with theme variables

components/
├── voice-chat-interface.tsx   # Main chat interface (UI only, no backend)
└── ui/
    ├── avatar.tsx             # Avatar component for user/AI
    ├── button.tsx             # Button component
    ├── card.tsx               # Card container
    ├── conversation.tsx       # Scrolling conversation container
    ├── message.tsx            # Message bubble with avatar
    ├── response.tsx           # Formatted response display
    ├── live-waveform.tsx      # Audio waveform visualizer
    └── orb.tsx                # Animated state indicator
```

### UI Components

#### 1. **VoiceChatInterface** (Main Component)
- **Location**: `components/voice-chat-interface.tsx`
- **Purpose**: Main application interface
- **Features**:
  - Header with title and settings button
  - Conversation area with message history
  - Voice controls with waveform visualizer
  - Sidebar with orb visualization and stats
- **State**: Currently uses mock data and local state

#### 2. **Conversation & Message Components**
- **Auto-scrolling**: Automatically scrolls to latest message
- **Message Types**: Supports user and assistant messages
- **Timestamps**: Shows when each message was sent
- **Styling**: Different alignment for user (right) vs assistant (left)

#### 3. **Live Waveform**
- **Visual Feedback**: Animated bars showing audio activity
- **States**: Active (animated) vs inactive (static)
- **Customizable**: Bar count, height, and colors

#### 4. **Orb Visualization**
- **Agent States**:
  - Idle (gray)
  - Listening (green, pulsing)
  - Thinking (yellow, pulsing)
  - Speaking (blue, pulsing)
- **Animation**: Smooth transitions between states

---

## Current Implementation

### What's Working (UI Only)

✅ **Layout & Design**
- Responsive grid layout
- Header with branding
- Sidebar with agent visualization
- Voice controls area

✅ **Mock Conversation**
- Sample messages pre-loaded
- Message bubbles with avatars
- Proper alignment and styling
- Timestamp display

✅ **Interactive Elements**
- Start/Stop listening button
- Auto-scroll to bottom
- Manual scroll with "scroll to bottom" button
- State indicator display

✅ **Visual Feedback**
- Waveform animation toggles with listening state
- Orb changes color based on agent state
- Button states (default vs destructive)

### What's NOT Connected Yet

❌ **Voice Input**
- No actual microphone access
- No speech-to-text processing
- Button is UI-only toggle

❌ **AI Backend**
- No ElevenLabs API integration
- No conversation API calls
- Messages are hardcoded

❌ **Real-time Features**
- No WebRTC connection
- No streaming responses
- No actual voice synthesis

---

## Next Steps: Backend Integration Plan

### Phase 1: Voice Input
- [ ] Integrate Web Audio API for microphone access
- [ ] Implement speech-to-text (ElevenLabs or Web Speech API)
- [ ] Connect waveform to actual audio levels
- [ ] Add permission handling for microphone

### Phase 2: AI Integration
- [ ] Set up ElevenLabs API client
- [ ] Configure agent ID and credentials
- [ ] Implement conversation API calls
- [ ] Handle streaming responses

### Phase 3: Real-time Communication
- [ ] Set up WebRTC or WebSocket connection
- [ ] Implement bidirectional voice streaming
- [ ] Add text-to-speech for AI responses
- [ ] Sync transcription with audio playback

### Phase 4: State Management
- [ ] Implement proper state management (Context/Redux)
- [ ] Add conversation persistence (localStorage/database)
- [ ] Handle connection states and errors
- [ ] Add retry logic and error boundaries

### Phase 5: Enhancements
- [ ] Add voice selection UI
- [ ] Implement settings panel
- [ ] Add conversation history export
- [ ] Add analytics and monitoring
- [ ] Add multi-language support

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + custom ElevenLabs-inspired components
- **Icons**: Lucide React

### Dependencies
```json
{
  "react": "^18.3.1",
  "next": "^14.2.0",
  "@radix-ui/react-*": "UI primitives",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.363.0"
}
```

### Future Dependencies (for backend integration)
- `@elevenlabs/react` - ElevenLabs React SDK
- `@elevenlabs/elevenlabs-js` - ElevenLabs JavaScript SDK
- Web Audio API (browser native)
- WebRTC or WebSocket library

---

## Getting Started

### Installation

```bash
cd /home/josh/Josh-AI/projects/active/voice-chat-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the UI.

### Build

```bash
npm run build
npm start
```

---

## Design Decisions

### Why ElevenLabs Components?
- Purpose-built for voice/audio interfaces
- Includes specialized components (waveform, orb, conversation)
- Consistent with the goal of using ElevenLabs API

### Why shadcn/ui?
- Copy-paste components (full control over code)
- Built on Radix UI primitives (accessibility)
- Customizable with Tailwind CSS
- No black-box dependencies

### UI-First Approach
- Design and validate UI/UX before backend complexity
- Easier to iterate on design
- Clear separation of concerns
- Allows parallel development (UI team + backend team)

---

## API Integration Guide

### ElevenLabs Configuration (Future)

**Required Environment Variables:**
```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

**Voice Chat Integration Points:**
1. `VoiceChatInterface` - Add ElevenLabs React hooks
2. `LiveWaveform` - Connect to actual audio stream
3. `Message` component - Receive streaming transcriptions
4. `Orb` component - Sync with actual agent state

**Example Integration (Placeholder):**
```typescript
// Future implementation
import { useConversation } from '@elevenlabs/react'

const { startConversation, status, messages } = useConversation({
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
})
```

---

## Project Structure

```
voice-chat-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── voice-chat-interface.tsx
│   └── ui/
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── conversation.tsx
│       ├── message.tsx
│       ├── response.tsx
│       ├── live-waveform.tsx
│       └── orb.tsx
├── lib/
│   └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.mjs
└── README.md
```

---

## Deployment

### Deploy to Netlify

This project is configured for easy deployment to Netlify.

#### Option 1: Deploy from GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/voice-chat-app.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Netlify will auto-detect Next.js configuration

3. **Configure Environment Variables:**
   - Go to Site settings → Environment variables
   - Add your ElevenLabs credentials:
     - `NEXT_PUBLIC_ELEVENLABS_API_KEY`
     - `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

#### Option 2: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Deploy
netlify deploy --prod
```

#### Build Configuration

The project includes a `netlify.toml` file with:
- ✅ Automatic Next.js build configuration
- ✅ Security headers (microphone permissions enabled)
- ✅ Static asset caching
- ✅ HTTPS redirect
- ✅ Node.js 20 environment

### Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables via Vercel dashboard
```

### Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

**Required for production:**
- `NEXT_PUBLIC_ELEVENLABS_API_KEY` - Get from [ElevenLabs API Settings](https://elevenlabs.io/app/settings/api-keys)
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` - Create at [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)

---

## Contributing

This is a personal project for Josh's AI assistant system. When implementing backend features:

1. Follow existing code patterns
2. Maintain TypeScript strict mode
3. Keep components modular and reusable
4. Add error handling and loading states
5. Document API integration points

---

## License

Private project - All rights reserved

---

## References

- [ElevenLabs UI Documentation](/home/josh/Josh-AI/technical-docs/elevenlabs/)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)

---

**Created:** 2025-10-23
**Status:** UI Design Complete
**Next:** Backend Integration Planning
