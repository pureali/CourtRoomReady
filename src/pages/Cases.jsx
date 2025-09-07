import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Plus, 
  Upload, 
  UserPlus, 
  ChevronDown,
  Calendar,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReadinessRing } from "@/components/ui/readiness-ring";

export default function Cases() {
  const [searchQuery, setSearchQuery] = useState("");

  // Extended mock data for all cases
  const allCases = [
    {
      id: 1,
      name: "Meridian Industries v. TechCorp",
      court: "High Court of Justice",
      hearingDate: "2025-02-15",
      leadCounsel: "Sarah Mitchell QC",
      witnessCount: 8,
      readinessScore: 84,
      status: "ready"
    },
    {
      id: 2,
      name: "Blackstone Financial Restructuring",
      court: "Commercial Court",
      hearingDate: "2025-01-28",
      leadCounsel: "James Reynolds",
      witnessCount: 12,
      readinessScore: 67,
      status: "in-progress"
    },
    {
      id: 3,
      name: "Global Logistics Partnership Dispute",
      court: "International Arbitration",
      hearingDate: "2025-03-05",
      leadCounsel: "Emma Chen",
      witnessCount: 6,
      readinessScore: 45,
      status: "high-risk"
    },
    {
      id: 4,
      name: "Healthcare Systems Acquisition",
      court: "Court of Appeal",
      hearingDate: "2025-02-20",
      leadCounsel: "David Thompson",
      witnessCount: 4,
      readinessScore: 72,
      status: "in-progress"
    },
    {
      id: 5,
      name: "Energy Sector Compliance Review",
      court: "Administrative Court",
      hearingDate: "2025-03-12",
      leadCounsel: "Rebecca Foster",
      witnessCount: 9,
      readinessScore: 58,
      status: "high-risk"
    },
    {
      id: 6,
      name: "Intellectual Property Portfolio Defense",
      court: "Patents Court",
      hearingDate: "2025-04-01",
      leadCounsel: "Michael Chang",
      witnessCount: 3,
      readinessScore: 91,
      status: "ready"
    }
  ];

  const handleStartSession = (caseId) => {
    // Navigate to court room with case data
    const caseData = allCases.find(c => c.id === caseId);
    const params = new URLSearchParams({
      fullName: "Alexandra Reid",
      caseType: caseData.name,
      caseDescription: `${caseData.court} - ${caseData.leadCounsel}`
    });
    window.location.href = `/court-room.html?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 h-16 bg-surface border-b border-line">
        <div className="max-w-[1200px] mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading font-semibold text-ink">CourtRoom Ready</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Dashboard
              </Link>
              <Link to="/cases" className="text-sm font-medium text-ink border-b-2 border-ink pb-1">
                Cases
              </Link>
              <Link to="/witnesses" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Witnesses
              </Link>
              <Link to="/documents" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Documents
              </Link>
              <Link to="/resources" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Resources
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <Input
                placeholder="Search cases, witnesses, or documents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 border-line focus:ring-2 focus:ring-ink focus:ring-offset-2"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent-err rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">Alexandra</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Alexandra Reid</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Firm Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-64 space-y-6">
            <Card className="bg-surface border border-line">
              <CardContent className="p-4">
                <h3 className="text-sm font-heading font-semibold text-ink mb-4">Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate mb-2 block">Court</label>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        High Court of Justice
                      </label>
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        Commercial Court
                      </label>
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        Court of Appeal
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate mb-2 block">Status</label>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        Ready
                      </label>
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        In progress
                      </label>
                      <label className="flex items-center text-sm text-slate">
                        <input type="checkbox" className="mr-2" />
                        High risk
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate mb-2 block">Hearing Date</label>
                    <div className="space-y-2">
                      <Input type="date" className="text-sm" />
                      <Input type="date" className="text-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-semibold text-ink">All Cases</h1>
                <p className="text-sm text-subtle">Manage your legal cases and track progress</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-line text-slate hover:text-ink">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {allCases.map((case_) => (
                <Card 
                  key={case_.id} 
                  className="bg-surface border border-line hover:shadow-lg transition-all duration-150 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-heading font-semibold text-ink pr-4">
                        {case_.name}
                      </h3>
                      <span 
                        className={`status-pill ${
                          case_.readinessScore >= 80 ? "ready" :
                          case_.readinessScore >= 60 ? "progress" : 
                          "behind"
                        }`}
                      >
                        {case_.readinessScore >= 80 ? "Ready" : case_.readinessScore >= 60 ? "In progress" : "Behind"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-subtle mb-4">
                      {case_.court} • {new Date(case_.hearingDate).toLocaleDateString()}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate">Lead Counsel: {case_.leadCounsel}</p>
                        <p className="text-sm text-slate">Witnesses: {case_.witnessCount} onboarded</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <ReadinessRing value={case_.readinessScore} size="md" />
                        <p className="text-xs text-subtle mt-1">Overall readiness</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Link to={`/cases/${case_.id}`} className="text-sm text-slate hover:text-ink transition-colors inline-flex items-center gap-1">
                        View details <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Button 
                        size="sm" 
                        className="bg-accent-ok hover:bg-accent-ok/90 text-surface"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartSession(case_.id);
                        }}
                      >
                        Start session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="pb-20 pt-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs text-subtle text-center">
            Generated by CourtRoom Ready • Model v1.2 • Prompt Pack 2025-09-06 • Audit log enabled
          </p>
        </div>
      </footer>
    </div>
  );
}
