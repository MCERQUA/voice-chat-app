"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  agentState?: "idle" | "listening" | "thinking" | "speaking"
}

const Orb = React.forwardRef<HTMLDivElement, OrbProps>(
  ({ className, agentState = "idle", ...props }, ref) => {
    const getStateColor = () => {
      switch (agentState) {
        case "listening":
          return "bg-green-500"
        case "thinking":
          return "bg-yellow-500"
        case "speaking":
          return "bg-blue-500"
        default:
          return "bg-gray-500"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full w-32 h-32 transition-all duration-300",
            getStateColor(),
            agentState !== "idle" && "animate-pulse"
          )}
        />
      </div>
    )
  }
)
Orb.displayName = "Orb"

export { Orb }
