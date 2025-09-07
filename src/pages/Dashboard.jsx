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
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { KpiCard } from "@/components/ui/kpi-card";
import { ReadinessRing } from "@/components/ui/readiness-ring";
import { AlertBanner } from "@/components/ui/alert-banner";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Mock data for cases
  const cases = [
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
    }
  ];

  const upcomingSessions = [
    {
      time: "09:00",
      witness: "Dr. Patricia Williams",
      mode: "Cross-examination",
      case: "Meridian v TechCorp",
      readiness: 84
    },
    {
      time: "14:30", 
      witness: "Mark Stevens",
      mode: "Direct examination",
      case: "Blackstone Financial",
      readiness: 67
    },
    {
      time: "10:00",
      witness: "Jennifer Liu", 
      mode: "Expert presentation",
      case: "Global Logistics",
      readiness: 55
    }
  ];

  const handleCaseClick = (caseId) => {
    window.location.href = `/cases/${caseId}`;
  };

  const handleStartSession = (caseId) => {
    // Navigate to court room with case data
    const caseData = cases.find(c => c.id === caseId);
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
              <Link to="/dashboard" className="text-sm font-medium text-ink border-b-2 border-ink pb-1">
                Dashboard
              </Link>
              <Link to="/cases" className="text-sm font-medium text-slate hover:text-ink transition-colors">
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative icon-button"
              onClick={() => setIsNotificationOpen(true)}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="badge-count">3</span>
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

      <main className="max-w-[1200px] mx-auto p-6 space-y-8">
        {/* Hero Strip */}
        <div className="bg-canvas py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-ink mb-2">
              Good morning, Alexandra
            </h2>
            <p className="text-sm text-slate">
              You have 3 active cases and 2 witnesses flagged for review.
            </p>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <KpiCard title="Active cases" value={3} link="/cases" />
            <KpiCard title="Witnesses in preparation" value={24} link="/witnesses" />
            <KpiCard title="Documents uploaded" value={156} link="/documents" />
        </div>

        {/* Alert Banner */}
        <AlertBanner
          message="Two witnesses need attention (readiness below threshold)."
          actionLabel="Review now"
          onAction={() => {
            // Deep-link to Witnesses table, pre-filtered to readiness < 60
            window.location.href = "/witnesses?filter=readiness-low";
          }}
          dismissible={true}
          storageKey="witnesses-attention-alert"
        />
        </div>

        {/* Section A - My Active Cases */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-ink">My Active Cases</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {cases.map((case_) => (
              <Card 
                key={case_.id} 
                className="bg-surface border border-line hover:shadow-lg transition-all duration-150 cursor-pointer group"
                onClick={() => handleCaseClick(case_.id)}
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
                    <a href="#" className="text-sm text-slate hover:text-ink transition-colors inline-flex items-center gap-1">
                      View details <ArrowRight className="h-3 w-3" />
                    </a>
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

        {/* Section B - Upcoming Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-semibold text-ink">Upcoming Sessions</h3>
              <p className="text-sm text-subtle">Next 48 hours — BST</p>
            </div>
            <Button variant="outline" size="sm" className="border-line text-slate hover:text-ink">
              View calendar
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-surface border border-line rounded-lg hover:bg-line/30 transition-colors group">
                <div className="w-2 h-2 rounded-full bg-accent-ok flex-shrink-0"></div>
                
                <div className="flex items-center gap-6 flex-1">
                  <span className="font-mono text-sm font-medium text-ink min-w-[3rem]">
                    {session.time}
                  </span>
                  
                  <Badge variant="outline" className="text-xs border-line">
                    {session.mode}
                  </Badge>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{session.witness}</p>
                    <p className="text-xs text-subtle">{session.case}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      session.readiness >= 80 ? "text-accent-ok bg-accent-ok/10" :
                      session.readiness >= 60 ? "text-accent-warn bg-accent-warn/10" :
                      "text-accent-err bg-accent-err/10"
                    }`}>
                      {session.readiness}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs border-line">
                    Prep notes
                  </Button>
                  <Button size="sm" className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Notification Panel */}
      <aside className={`notif-drawer ${isNotificationOpen ? 'open' : ''}`}>
        <header className="flex items-center justify-between p-6 border-b border-line">
          <h3 className="text-lg font-heading font-semibold text-ink">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsNotificationOpen(false)}
            aria-label="Close"
            className="text-slate hover:text-ink"
          >
            ✕
          </Button>
        </header>

        <ul className="notif-list">
          <li>
            <strong className="text-sm font-medium text-ink">Witness readiness low</strong><br/>
            <span className="text-sm text-slate">Patricia Williams dropped to 55% · Meridian v TechCorp</span>
            <Link to="/witnesses?filter=Needs+attention" className="text-sm text-accent-ok hover:underline inline-flex items-center gap-1 mt-2">
              View details <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
          <li>
            <strong className="text-sm font-medium text-ink">New document uploaded</strong><br/>
            <span className="text-sm text-slate">Blackstone Financial</span>
            <Link to="/documents/blackstone" className="text-sm text-accent-ok hover:underline inline-flex items-center gap-1 mt-2">
              Open file <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
          <li>
            <strong className="text-sm font-medium text-ink">Hearing date updated</strong><br/>
            <span className="text-sm text-slate">Healthcare Systems</span>
            <Link to="/cases/healthcare" className="text-sm text-accent-ok hover:underline inline-flex items-center gap-1 mt-2">
              See case <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
        </ul>
      </aside>

      {/* Sticky Quick-Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-line">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-4 h-full px-6">
          <Link to="/session/new">
            <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface gap-2">
              <Plus className="h-4 w-4" />
              Start new session
            </Button>
          </Link>
          <Link to="/documents/upload">
            <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface gap-2">
              <Upload className="h-4 w-4" />
              Upload documents
            </Button>
          </Link>
          <Link to="/witnesses/invite">
            <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface gap-2">
              <UserPlus className="h-4 w-4" />
              Invite witness
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer for compliance */}
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
