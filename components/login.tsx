"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LoginProps {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store authentication in sessionStorage
        sessionStorage.setItem('authenticated', 'true')
        onLogin()
      } else {
        setError(data.error || 'Invalid password')
        setPassword("")
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Voice Chat</h1>
          <p className="text-sm text-muted-foreground">AI Assistant with Claude Code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
              disabled={isLoading}
              className="w-full bg-muted text-foreground placeholder:text-muted-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!password || isLoading}
            className="w-full"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Secure access to Josh-AI system</p>
        </div>
      </Card>
    </div>
  )
}
