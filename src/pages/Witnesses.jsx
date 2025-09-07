import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ChevronDown,
  Filter,
  UserPlus,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReadinessRing } from "@/components/ui/readiness-ring";

export default function Witnesses() {
  const [searchQuery, setSearchQuery] = useState("");

  const witnesses = [
    {
      id: 1,
      name: "Dr. Patricia Williams",
      case: "Meridian v TechCorp",
      type: "Expert",
      lastSession: "2025-01-03",
      readiness: 84,
      status: "Ready"
    },
    {
      id: 2,
      name: "Mark Stevens",
      case: "Blackstone Financial",
      type: "Factual",
      lastSession: "2025-01-02",
      readiness: 67,
      status: "In progress"
    },
    {
      id: 3,
      name: "Jennifer Liu",
      case: "Global Logistics",
      type: "Expert",
      lastSession: "2024-12-20",
      readiness: 55,
      status: "Needs attention"
    },
    {
      id: 4,
      name: "Robert Chen",
      case: "Healthcare Systems",
      type: "Factual",
      lastSession: "2025-01-01",
      readiness: 72,
      status: "In progress"
    },
    {
      id: 5,
      name: "Sarah Thompson",
      case: "Energy Sector",
      type: "Expert",
      lastSession: "Never",
      readiness: 28,
      status: "Needs attention"
    },
    {
      id: 6,
      name: "Michael Foster",
      case: "IP Portfolio",
      type: "Factual",
      lastSession: "2025-01-04",
      readiness: 91,
      status: "Ready"
    }
  ];

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
              <Link to="/cases" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Cases
              </Link>
              <Link to="/witnesses" className="text-sm font-medium text-ink border-b-2 border-ink pb-1">
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

      <main className="max-w-[1200px] mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-ink">Witness Management</h1>
            <p className="text-sm text-subtle">Track witness preparation and readiness</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-line text-slate hover:text-ink">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Witness
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-line/30">Factual</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-line/30">Expert</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-line/30 border-accent-err text-accent-err">Needs attention</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-line/30 border-accent-ok text-accent-ok">Ready</Badge>
        </div>

        {/* Witness Table */}
        <Card className="bg-surface border border-line">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Case</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Session</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {witnesses.map((witness) => (
                  <TableRow key={witness.id} className="hover:bg-line/30">
                    <TableCell className="font-medium text-ink">{witness.name}</TableCell>
                    <TableCell className="text-slate">{witness.case}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {witness.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate">{witness.lastSession}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ReadinessRing value={witness.readiness} size="sm" />
                        <span className="text-sm font-mono">{witness.readiness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`status-pill ${
                          witness.status === "Ready" ? "ready" :
                          witness.status === "In progress" ? "progress" :
                          "behind"
                        }`}
                      >
                        {witness.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-slate hover:text-ink">
                        <Eye className="h-4 w-4 mr-1" />
                        View analytics
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
