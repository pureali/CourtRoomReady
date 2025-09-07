import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function KpiCard({ title, value, link }) {
  return (
    <Link to={link} className="block">
      <div className="bg-surface border border-line rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold text-ink mb-1">{value}</div>
        <div className="text-sm text-slate">{title}</div>
        <div className="flex items-center text-xs text-accent-ok mt-2">
          View details <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </div>
    </Link>
  )
}
