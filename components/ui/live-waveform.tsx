"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LiveWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  barCount?: number
  height?: number
}

const LiveWaveform = React.forwardRef<HTMLDivElement, LiveWaveformProps>(
  ({ className, active = false, barCount = 20, height = 64, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        style={{ height: `${height}px` }}
        {...props}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full bg-foreground transition-all duration-150",
              active ? "animate-pulse" : ""
            )}
            style={{
              height: active
                ? `${Math.random() * 60 + 20}%`
                : "20%",
            }}
          />
        ))}
      </div>
    )
  }
)
LiveWaveform.displayName = "LiveWaveform"

export { LiveWaveform }
