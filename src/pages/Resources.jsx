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
  ChevronDown,
  Download,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  Clock,
  Users,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");

  const resources = [
    {
      id: 1,
      title: "Witness Etiquette Slides",
      description: "Comprehensive presentation covering courtroom behavior, dress code, and testimony best practices",
      type: "Presentation",
      icon: Video,
      size: "12.4 MB",
      updated: "2025-01-05",
      category: "Training"
    },
    {
      id: 2,
      title: "Best-practice Checklist",
      description: "Pre-session checklist to ensure optimal witness preparation and case readiness",
      type: "Checklist",
      icon: CheckSquare,
      size: "284 KB",
      updated: "2024-12-28",
      category: "Preparation"
    },
    {
      id: 3,
      title: "AI Prompt Packs PDF",
      description: "Curated collection of effective AI prompts for legal research and document analysis",
      type: "Guide",
      icon: FileText,
      size: "1.8 MB",
      updated: "2025-01-02",
      category: "AI Tools"
    },
    {
      id: 4,
      title: "Cross-Examination Techniques",
      description: "Advanced strategies and methodologies for effective witness cross-examination",
      type: "Manual",
      icon: BookOpen,
      size: "3.2 MB",
      updated: "2024-12-15",
      category: "Training"
    },
    {
      id: 5,
      title: "Digital Evidence Handling",
      description: "Guidelines for managing and presenting digital evidence in court proceedings",
      type: "Guide",
      icon: FileText,
      size: "2.1 MB",
      updated: "2024-12-10",
      category: "Evidence"
    },
    {
      id: 6,
      title: "Client Communication Templates",
      description: "Professional email templates for various stages of case preparation and updates",
      type: "Templates",
      icon: MessageSquare,
      size: "456 KB",
      updated: "2024-11-28",
      category: "Communication"
    }
  ];

  const categories = ["All", "Training", "Preparation", "AI Tools", "Evidence", "Communication"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

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
              <Link to="/witnesses" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Witnesses
              </Link>
              <Link to="/documents" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Documents
              </Link>
              <Link to="/resources" className="text-sm font-medium text-ink border-b-2 border-ink pb-1">
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
            <h1 className="text-2xl font-heading font-semibold text-ink">Resource Hub</h1>
            <p className="text-sm text-subtle">Access training materials, guides, and best practice resources</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer hover:bg-line/30 ${
                selectedCategory === category 
                  ? "bg-ink text-surface" 
                  : "border-line text-slate hover:text-ink"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Card key={resource.id} className="bg-surface border border-line hover:shadow-lg transition-all duration-150 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-line/30 rounded-lg">
                      <IconComponent className="h-5 w-5 text-ink" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-semibold text-ink mb-1">
                        {resource.title}
                      </h3>
                      <Badge variant="outline" className="text-xs mb-2">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-subtle mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Updated {resource.updated}</span>
                    </div>
                    <span className="font-mono">{resource.size}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-accent-ok hover:bg-accent-ok/90 text-surface group-hover:bg-accent-ok/80"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <div className="mt-12">
          <h2 className="text-lg font-heading font-semibold text-ink mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface border border-line p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-ok/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent-ok" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Training Schedule</h3>
                  <p className="text-xs text-subtle">View upcoming training sessions</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-surface border border-line p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-warn/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-accent-warn" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Support Center</h3>
                  <p className="text-xs text-subtle">Get help and submit feedback</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-surface border border-line p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ink/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Knowledge Base</h3>
                  <p className="text-xs text-subtle">Browse FAQs and tutorials</p>
                </div>
              </div>
            </Card>
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
