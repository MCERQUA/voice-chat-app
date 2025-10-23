"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from: "user" | "assistant"
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, from, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          from === "user" ? "flex-row-reverse" : "flex-row",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Message.displayName = "Message"

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "contained" | "flat"
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, variant = "contained", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 rounded-lg px-4 py-3",
          variant === "contained" && "bg-muted",
          className
        )}
        {...props}
      />
    )
  }
)
MessageContent.displayName = "MessageContent"

interface MessageAvatarProps {
  src?: string
  name: string
  className?: string
}

const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ src, name, className }, ref) => {
    const fallback = name.slice(0, 2).toUpperCase()
    return (
      <Avatar className={cn("h-10 w-10", className)} ref={ref}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    )
  }
)
MessageAvatar.displayName = "MessageAvatar"

export { Message, MessageContent, MessageAvatar }
