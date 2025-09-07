import React from 'react'

export function ReadinessRing({ value, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5
  const radius = size === "sm" ? 12 : size === "md" ? 18 : 24
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  const getColor = (val) => {
    if (val >= 80) return "#059669" // green
    if (val >= 60) return "#d97706" // orange
    return "#dc2626" // red
  }

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-ink">
          {value}%
        </span>
      </div>
    </div>
  )
}
