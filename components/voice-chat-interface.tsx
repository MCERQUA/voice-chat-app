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
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Voice Chat</h1>
          <p className="text-sm text-muted-foreground">AI Assistant with Live Transcription</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Conversation Area */}
        <div className="flex-1 flex flex-col min-h-0">
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

          {/* Voice Controls */}
          <Card className="m-4 p-4 border-t rounded-lg">
            <div className="flex flex-col gap-4">
              {/* Waveform Visualizer */}
              <div className="bg-muted rounded-lg p-2">
                <LiveWaveform active={isListening} height={60} barCount={30} />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleListening}
                  className="gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      Start Voice Chat
                    </>
                  )}
                </Button>
              </div>

              {/* Status Indicator */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span className="font-medium text-foreground">
                    {agentState === "idle" && "Ready"}
                    {agentState === "listening" && "Listening..."}
                    {agentState === "thinking" && "Processing..."}
                    {agentState === "speaking" && "Speaking..."}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Agent Visualization */}
        <div className="w-full lg:w-80 border-l flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Agent Status</h2>
            <p className="text-xs text-muted-foreground">Visual feedback</p>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <Orb agentState={agentState} className="w-full" />
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Messages</span>
              <span className="font-medium">{messages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mode</span>
              <span className="font-medium">Voice</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Connection</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
