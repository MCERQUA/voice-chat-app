"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Response = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Response.displayName = "Response"

export { Response }
