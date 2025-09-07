import * as React from "react"
import { cn } from "@/lib/utils"

const StatusBadge = React.forwardRef(({ 
  className, 
  status, 
  children, 
  ...props 
}, ref) => {
  const getStatusClasses = () => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high-risk":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusClasses(),
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
