"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Conversation, ConversationContent } from "@/components/ui/conversation"
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
import { LiveWaveform } from "@/components/ui/live-waveform"
import { Orb } from "@/components/ui/orb"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Settings, Send, LogOut } from "lucide-react"

interface ChatMessage {
  id: string
  from: "user" | "assistant"
  content: string
  timestamp: Date
}

interface VoiceChatInterfaceProps {
  onLogout?: () => void
  isFirstLogin?: boolean
}

export function VoiceChatInterface({ onLogout, isFirstLogin }: VoiceChatInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [agentState, setAgentState] = React.useState<"idle" | "listening" | "thinking" | "speaking">("idle")
  const [inputMessage, setInputMessage] = React.useState("")
  const [sessionId, setSessionId] = React.useState<string>(`session-${Date.now()}`)
  const [isLoading, setIsLoading] = React.useState(false)

  // Start with an empty conversation
  const [messages, setMessages] = React.useState<ChatMessage[]>([])

  // Auto-run /josh-intro on first login
  React.useEffect(() => {
    if (isFirstLogin && messages.length === 0) {
      // Send the /josh-intro command automatically
      sendAutoMessage("/josh-intro")
    }
  }, [isFirstLogin])

  const toggleListening = () => {
    setIsListening(!isListening)
    setAgentState(isListening ? "idle" : "listening")
  }

  const sendAutoMessage = async (message: string) => {
    // Send a message without showing user input (for auto commands)
    setAgentState("thinking")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        from: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages([assistantMessage])
      setAgentState("idle")

    } catch (error) {
      console.error('Error sending auto message:', error)
      setAgentState("idle")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      from: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setAgentState("thinking")
    setIsLoading(true)

    try {
      // Call our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        from: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      setAgentState("idle")

    } catch (error) {
      console.error('Error sending message:', error)

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        from: "assistant",
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
      setAgentState("idle")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            {onLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
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

        {/* Input Controls - Bottom Fixed */}
        <div className="border-t bg-card">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-col gap-2">
              {/* Text Input Row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 bg-muted text-foreground placeholder:text-muted-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="default"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>

              {/* Voice Controls Row (for future use) */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="flex-1 bg-muted rounded-lg p-1.5">
                  <LiveWaveform active={isListening} height={30} barCount={20} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleListening}
                  disabled
                  className="gap-2 shrink-0"
                >
                  <Mic className="h-3 w-3" />
                  Voice (Soon)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
