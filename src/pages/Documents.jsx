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
  Upload,
  FolderOpen,
  FileText,
  Download,
  Eye,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("Meridian v TechCorp");

  const caseFolders = [
    { name: "Meridian v TechCorp", docCount: 24 },
    { name: "Blackstone Financial", docCount: 18 },
    { name: "Global Logistics", docCount: 12 },
    { name: "Healthcare Systems", docCount: 8 },
    { name: "Energy Sector", docCount: 15 },
    { name: "IP Portfolio", docCount: 6 }
  ];

  const documents = [
    {
      id: 1,
      name: "Expert_Report_Williams_v2.pdf",
      type: "Expert Report",
      size: "2.4 MB",
      uploaded: "2025-01-03",
      version: "v2.0",
      status: "Final"
    },
    {
      id: 2,
      name: "Witness_Statement_Stevens.docx",
      type: "Witness Statement",
      size: "156 KB",
      uploaded: "2025-01-02",
      version: "v1.0", 
      status: "Draft"
    },
    {
      id: 3,
      name: "Technical_Specifications.pdf",
      type: "Exhibit",
      size: "8.2 MB",
      uploaded: "2024-12-20",
      version: "v1.0",
      status: "Final"
    },
    {
      id: 4,
      name: "Contract_Analysis_2024.xlsx",
      type: "Analysis",
      size: "892 KB",
      uploaded: "2024-12-18",
      version: "v3.1",
      status: "Final"
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
              <Link to="/witnesses" className="text-sm font-medium text-slate hover:text-ink transition-colors">
                Witnesses
              </Link>
              <Link to="/documents" className="text-sm font-medium text-ink border-b-2 border-ink pb-1">
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
          {/* Left Sidebar - Case Folders */}
          <div className="w-64 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-semibold text-ink">Case Folders</h3>
            </div>
            
            <div className="space-y-2">
              {caseFolders.map((folder) => (
                <div
                  key={folder.name}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFolder === folder.name 
                      ? "bg-ink text-surface" 
                      : "bg-surface border border-line hover:bg-line/30"
                  }`}
                  onClick={() => setSelectedFolder(folder.name)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">{folder.name}</span>
                  </div>
                  <p className={`text-xs mt-1 ${
                    selectedFolder === folder.name ? "text-surface/70" : "text-subtle"
                  }`}>
                    {folder.docCount} documents
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-subtle mb-1">
                  <span>Documents</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-ink font-medium">{selectedFolder}</span>
                </div>
                <h1 className="text-2xl font-heading font-semibold text-ink">Document Repository</h1>
              </div>
              <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-surface border border-line p-4 text-center">
                <div className="text-sm text-subtle">Statements</div>
                <div className="text-xl font-mono font-semibold text-ink">8</div>
              </Card>
              <Card className="bg-surface border border-line p-4 text-center">
                <div className="text-sm text-subtle">Reports</div>
                <div className="text-xl font-mono font-semibold text-ink">6</div>
              </Card>
              <Card className="bg-surface border border-line p-4 text-center">
                <div className="text-sm text-subtle">Exhibits</div>
                <div className="text-xl font-mono font-semibold text-ink">7</div>
              </Card>
              <Card className="bg-surface border border-line p-4 text-center">
                <div className="text-sm text-subtle">Analysis</div>
                <div className="text-xl font-mono font-semibold text-ink">3</div>
              </Card>
            </div>

            {/* Documents Table */}
            <Card className="bg-surface border border-line">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-line/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-subtle" />
                            <span className="font-medium text-ink">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-slate">{doc.size}</TableCell>
                        <TableCell className="text-slate">{doc.uploaded}</TableCell>
                        <TableCell className="font-mono text-sm text-slate">{doc.version}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`text-xs ${
                              doc.status === "Final" ? "bg-accent-ok text-surface" : "bg-accent-warn text-surface"
                            }`}
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-slate hover:text-ink">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate hover:text-ink">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
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
