# Voice Chat App - Design Documentation

## Interface Design Overview

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header: Voice Chat | Settings                           │
├──────────────────────────────────┬──────────────────────┤
│                                  │   Agent Status       │
│  Conversation Area               │                      │
│  ┌────────────────────────────┐  │   ┌──────────────┐   │
│  │ [AI] Hello! How can I...  │  │   │              │   │
│  └────────────────────────────┘  │   │     Orb      │   │
│                                  │   │              │   │
│  ┌────────────────────────────┐  │   └──────────────┘   │
│  │ [You] I need help with... │  │                      │
│  └────────────────────────────┘  │   Stats:             │
│                                  │   Messages: 3        │
│  ┌────────────────────────────┐  │   Mode: Voice        │
│  │ [AI] I'd be happy to...   │  │   Status: Connected  │
│  └────────────────────────────┘  │                      │
│                                  │                      │
├──────────────────────────────────┴──────────────────────┤
│ Voice Controls                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │     [Waveform Visualization]                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│           [🎤 Start Voice Chat]                         │
│                                                         │
│              Status: Ready                              │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme

- **Background**: Light/Dark mode support via CSS variables
- **Primary**: Slate blue for interactive elements
- **States**:
  - Idle: Gray (#6B7280)
  - Listening: Green (#10B981)
  - Thinking: Yellow (#F59E0B)
  - Speaking: Blue (#3B82F6)

### Typography

- **Font**: Inter (Google Fonts)
- **Heading**: 2xl, bold
- **Body**: sm, regular
- **Timestamps**: xs, muted

---

## Component Breakdown

### 1. Header Section
- **Title**: "Voice Chat"
- **Subtitle**: "AI Assistant with Live Transcription"
- **Settings Button**: Placeholder for future configuration

### 2. Conversation Area
**Layout**: Flex column, scrollable
**Messages**: Left-aligned (AI) and right-aligned (User)

**Message Structure**:
```tsx
<Message from="user|assistant">
  <MessageAvatar name="..." src="..." />
  <MessageContent>
    {/* User: plain text */}
    {/* AI: formatted Response component */}
    <timestamp />
  </MessageContent>
</Message>
```

**Features**:
- Auto-scroll to bottom on new messages
- Manual scroll with "scroll to bottom" button
- Timestamps for each message
- Avatar with fallback initials

### 3. Voice Controls
**Waveform Visualizer**:
- 30 animated bars
- Height: 60px
- Active when listening
- Gray background container

**Control Button**:
- Toggle: "Start Voice Chat" ↔ "Stop Listening"
- Icon: Mic / MicOff
- Variant: Default ↔ Destructive (red)
- Size: Large

**Status Indicator**:
- Text display showing agent state
- Updates based on agentState variable

### 4. Sidebar (Agent Visualization)
**Header**: "Agent Status"

**Orb Display**:
- Centered in sidebar
- Size: 128px × 128px
- Animated based on state
- Pulse effect when active

**Stats Panel**:
- Message count
- Current mode
- Connection status

---

## State Management

### Current State (UI Only)

```typescript
// Voice state
const [isListening, setIsListening] = useState(false)

// Agent state
const [agentState, setAgentState] = useState<
  "idle" | "listening" | "thinking" | "speaking"
>("idle")

// Messages (mock data)
const [messages, setMessages] = useState<ChatMessage[]>([...])
```

### Future State (Backend Integration)

```typescript
// Connection state
const [connectionStatus, setConnectionStatus] = useState<
  "disconnected" | "connecting" | "connected" | "error"
>("disconnected")

// Audio stream
const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

// Real-time transcription
const [currentTranscript, setCurrentTranscript] = useState("")

// Agent response streaming
const [streamingResponse, setStreamingResponse] = useState("")
```

---

## Responsive Design

### Desktop (lg: 1024px+)
- Sidebar visible on right
- Full conversation area
- Two-column layout

### Mobile (< 1024px)
- Sidebar below conversation
- Single column layout
- Collapsible agent visualization

---

## Interaction Flow

### Voice Chat Activation
1. User clicks "Start Voice Chat"
2. Button changes to "Stop Listening" (red)
3. Waveform becomes active (animated)
4. Agent state changes to "listening" (green orb)
5. Status shows "Listening..."

### Message Flow (Future)
1. User speaks → Waveform animates
2. Speech detected → Agent state: "thinking"
3. Transcription added to messages
4. AI response streams in
5. Agent state: "speaking"
6. TTS plays audio
7. Return to "listening" state

---

## Animation Details

### Waveform
- **Bar Count**: 30
- **Update Rate**: Continuous while active
- **Height Variance**: 20% (min) to 80% (max)
- **Animation**: Pulse effect, random heights

### Orb
- **Transition**: 300ms ease
- **Pulse**: CSS animation when not idle
- **Colors**: Instant change, size pulsates

### Scroll
- **Behavior**: Smooth scroll
- **Trigger**: New message or button click
- **Button**: Fade in when scrolled up, absolute positioned

---

## Accessibility

### ARIA Labels
- Button states announced
- Icon-only buttons have labels
- Status changes announced

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons
- Escape to stop listening (future)

### Color Contrast
- WCAG AA compliant
- State colors distinguishable
- Dark mode support

---

## Future UI Enhancements

### Settings Panel
- Voice selection
- Volume controls
- Transcription language
- Audio quality settings

### Conversation Features
- Search messages
- Export transcript
- Clear conversation
- Message reactions

### Visual Feedback
- Typing indicators
- Connection quality meter
- Error notifications
- Success confirmations

---

## Design Decisions Rationale

### Why Orb Visualization?
- Non-intrusive visual feedback
- Clear state communication
- Matches ElevenLabs brand
- Engaging user experience

### Why Sidebar Stats?
- Quick status overview
- Professional appearance
- Space for future metrics
- Desktop real estate usage

### Why Waveform?
- Industry standard for voice apps
- Clear audio activity indicator
- Familiar to users
- Technical aesthetic

### Why Mock Data?
- UI validation before complexity
- Faster iteration cycles
- Independent frontend development
- Clear separation of concerns

---

## File Organization

```
components/
├── voice-chat-interface.tsx    # Main container, state management
└── ui/                         # Reusable components
    ├── avatar.tsx              # User/AI avatars
    ├── button.tsx              # Interactive buttons
    ├── card.tsx                # Container cards
    ├── conversation.tsx        # Scrolling container
    ├── message.tsx             # Message bubbles
    ├── response.tsx            # Formatted AI responses
    ├── live-waveform.tsx       # Audio visualizer
    └── orb.tsx                 # State indicator
```

---

**Design Philosophy**: Clean, professional, voice-first interface with clear visual feedback and intuitive controls.
