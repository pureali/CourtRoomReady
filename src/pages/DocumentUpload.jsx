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
  ChevronRight,
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "Expert_Report_Williams_v2.pdf",
      size: "2.4 MB",
      status: "uploaded",
      version: "v2.0"
    }
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log("Files dropped:", e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(files => files.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 h-16 bg-surface border-b border-line">
        <div className="max-w-[1200px] mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading font-semibold text-ink">CourtPrep</span>
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
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-subtle">
          <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-ink font-medium">Upload Documents</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-ink">Upload Documents</h1>
            <p className="text-sm text-subtle">Add case documents, statements, and exhibits</p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card className="bg-surface border border-line">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? "border-accent-ok bg-accent-ok/5" 
                  : "border-line hover:border-accent-ok/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-subtle mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-ink mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-subtle mb-4">
                Supports PDF, DOC, DOCX, XLS, XLSX files up to 50MB
              </p>
              <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Case Selection */}
        <Card className="bg-surface border border-line">
          <CardContent className="p-6">
            <h3 className="text-lg font-heading font-semibold text-ink mb-4">Document Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate mb-2 block">Case</label>
                <select className="w-full p-2 border border-line rounded-lg text-ink">
                  <option>Select a case...</option>
                  <option>Meridian Industries v. TechCorp</option>
                  <option>Blackstone Financial Restructuring</option>
                  <option>Global Logistics Partnership Dispute</option>
                  <option>Healthcare Systems Acquisition</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate mb-2 block">Document Type</label>
                <select className="w-full p-2 border border-line rounded-lg text-ink">
                  <option>Select type...</option>
                  <option>Witness Statement</option>
                  <option>Expert Report</option>
                  <option>Exhibit</option>
                  <option>Contract</option>
                  <option>Correspondence</option>
                  <option>Analysis</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-slate mb-2 block">Version Tag</label>
              <Input placeholder="e.g., v1.0, Draft, Final" className="border-line" />
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card className="bg-surface border border-line">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-semibold text-ink mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-line/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-subtle" />
                      <div>
                        <p className="text-sm font-medium text-ink">{file.name}</p>
                        <p className="text-xs text-subtle">{file.size} • {file.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploaded" ? (
                        <CheckCircle className="h-5 w-5 text-accent-ok" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-accent-warn" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-subtle hover:text-accent-err"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Link to="/dashboard">
            <Button variant="outline" className="border-line text-slate hover:text-ink">
              Cancel
            </Button>
          </Link>
          <Button className="bg-accent-ok hover:bg-accent-ok/90 text-surface">
            Upload Documents
          </Button>
        </div>
      </main>

      <footer className="pb-20 pt-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs text-subtle text-center">
            Generated by CourtPrep • Model v1.2 • Prompt Pack 2025-09-06 • Audit log enabled
          </p>
        </div>
      </footer>
    </div>
  );
}
