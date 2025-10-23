"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Conversation, ConversationContent } from "@/components/ui/conversation"
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
import { LiveWaveform } from "@/components/ui/live-waveform"
import { Orb } from "@/components/ui/orb"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Settings } from "lucide-react"

interface ChatMessage {
  id: string
  from: "user" | "assistant"
  content: string
  timestamp: Date
}

export function VoiceChatInterface() {
  const [isListening, setIsListening] = React.useState(false)
  const [agentState, setAgentState] = React.useState<"idle" | "listening" | "thinking" | "speaking">("idle")

  // Mock messages for UI demonstration
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      from: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      from: "user",
      content: "I need help understanding the ElevenLabs voice API.",
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: "3",
      from: "assistant",
      content: "I'd be happy to help you understand the ElevenLabs voice API. The API provides several key features:\n\n- Text-to-speech conversion with multiple voices\n- Real-time voice streaming\n- Custom voice cloning\n- Voice settings customization\n\nWhat specific aspect would you like to know more about?",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const toggleListening = () => {
    setIsListening(!isListening)
    setAgentState(isListening ? "idle" : "listening")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Voice Chat</h1>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">State:</span>
            <span className="font-medium">
              {agentState === "idle" && "Ready"}
              {agentState === "listening" && "Listening"}
              {agentState === "thinking" && "Thinking"}
              {agentState === "speaking" && "Speaking"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Messages:</span>
            <span className="font-medium">{messages.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Connection:</span>
            <span className="font-medium text-green-500">Active</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Conversation Area */}
        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} from={message.from}>
                <MessageAvatar
                  name={message.from === "user" ? "You" : "AI"}
                  src={message.from === "assistant" ? "/ai-avatar.png" : undefined}
                />
                <MessageContent>
                  {message.from === "assistant" ? (
                    <Response>{message.content}</Response>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>

        {/* Voice Controls - Bottom Fixed */}
        <div className="border-t bg-card">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Waveform Visualizer */}
              <div className="flex-1 bg-muted rounded-lg p-2">
                <LiveWaveform active={isListening} height={40} barCount={24} />
              </div>

              {/* Control Button */}
              <Button
                variant={isListening ? "destructive" : "default"}
                size="default"
                onClick={toggleListening}
                className="gap-2 shrink-0"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
