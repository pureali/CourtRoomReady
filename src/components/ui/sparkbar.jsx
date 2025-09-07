import * as React from "react"
import { cn } from "@/lib/utils"

const Sparkbar = React.forwardRef(({ 
  className, 
  value, 
  variant = "default", 
  ...props 
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          getVariantClasses()
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
})
Sparkbar.displayName = "Sparkbar"

export { Sparkbar }
