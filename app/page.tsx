"use client"

import * as React from "react"
import { VoiceChatInterface } from "@/components/voice-chat-interface"
import { Login } from "@/components/login"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  // Check authentication on mount
  React.useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <VoiceChatInterface onLogout={handleLogout} />
}
