"use client"

import * as React from "react"
import { VoiceChatInterface } from "@/components/voice-chat-interface"
import { Login } from "@/components/login"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isFirstLogin, setIsFirstLogin] = React.useState(false)

  // Check authentication on mount
  React.useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setIsFirstLogin(true) // Flag that this is a fresh login
  }

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated')
    setIsAuthenticated(false)
    setIsFirstLogin(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <VoiceChatInterface onLogout={handleLogout} isFirstLogin={isFirstLogin} />
}
