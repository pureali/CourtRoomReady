import React, { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function AlertBanner({ 
  message, 
  actionLabel, 
  onAction, 
  dismissible = false, 
  storageKey = null 
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (storageKey && dismissible) {
      const dismissed = localStorage.getItem(storageKey)
      if (dismissed === 'true') {
        setIsVisible(false)
      }
    }
  }, [storageKey, dismissible])

  const handleDismiss = () => {
    setIsVisible(false)
    if (storageKey) {
      localStorage.setItem(storageKey, 'true')
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-accent-warn/10 border border-accent-warn/20 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-accent-warn flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-ink font-medium">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-sm text-accent-warn hover:text-accent-warn/80 font-medium mt-1 underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-slate hover:text-ink transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
