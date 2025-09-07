import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  Upload
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Sparkbar } from "@/components/ui/sparkbar";
import { StatusBadge } from "@/components/ui/status-badge";

export default function CaseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");

  // Check if coming from court room and switch to analytics tab
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes('court_room.html')) {
      setActiveTab("analytics");
    }
  }, []);

  // Mock case data
  const caseData = {
    id: 1,
    name: "Meridian Industries v. TechCorp",
    reference: "HC-2024-001847",
    court: "High Court of Justice, Commercial Court",
    hearingDate: "2025-02-15",
    tags: ["Cross-Border", "Intellectual Property", "High Value"],
    readinessScore: 84
  };

  const witnesses = [
    {
      id: 1,
      name: "Dr. Patricia Williams",
      type: "Expert",
      status: "ready",
      lastSession: "2025-01-10",
      readinessScore: 92
    },
    {
      id: 2,
      name: "Mark Stevens",
      type: "Factual",
      status: "in-progress",
      lastSession: "2025-01-08",
      readinessScore: 78
    },
    {
      id: 3,
      name: "Jennifer Liu",
      type: "Expert",
      status: "high-risk",
      lastSession: "2025-01-05",
      readinessScore: 45
    },
    {
      id: 4,
      name: "David Chen",
      type: "Factual",
      status: "in-progress",
      lastSession: "2025-01-12",
      readinessScore: 68
    }
  ];

  const timelineEvents = [
    {
      id: 1,
      type: "session",
      title: "Cross-examination session with Dr. Williams",
      description: "Significant improvement in clarity and composure metrics",
      date: "2025-01-10 14:30",
      status: "completed"
    },
    {
      id: 2,
      type: "document",
      title: "Expert report uploaded",
      description: "Technical analysis of patent infringement claims",
      date: "2025-01-09 10:15",
      status: "processed"
    },
    {
      id: 3,
      type: "filing",
      title: "Defense statement filed",
      description: "Comprehensive response to plaintiff's allegations",
      date: "2025-01-08 16:45",
      status: "filed"
    }
  ];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-line bg-surface/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-ink mb-2">
                {caseData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-subtle">
                <span>Ref: {caseData.reference}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Hearing: {new Date(caseData.hearingDate).toLocaleDateString()}
                </span>
                <span>{caseData.court}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {caseData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link to="/session/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Session
                </Button>
              </Link>
              <Link to="/documents/upload">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="witnesses">Witnesses</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Case Timeline</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {timelineEvents.map((event) => (
                <Card key={event.id} className="border border-line">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-accent-ok rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <span className="text-sm text-subtle">
                            {new Date(event.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-subtle mb-3">{event.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="witnesses" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-heading font-semibold">Case Witnesses</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  <Input
                    placeholder="Search witnesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {witnesses.map((witness) => (
                <Card key={witness.id} className="border border-line hover:border-accent-ok cursor-pointer transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-1">
                          {witness.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-subtle">
                          <Badge variant="outline">{witness.type} Witness</Badge>
                          <span>Last session: {new Date(witness.lastSession).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <StatusBadge status={witness.status}>
                        {witness.status === "ready" ? "Ready" : 
                         witness.status === "in-progress" ? "In Progress" : 
                         witness.status === "high-risk" ? "High Risk" : "Unknown"}
                      </StatusBadge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-subtle">Readiness:</span>
                        <Sparkbar 
                          value={witness.readinessScore} 
                          variant={
                            witness.readinessScore >= 80 ? "success" : 
                            witness.readinessScore >= 60 ? "warning" : "danger"
                          }
                          className="w-24"
                        />
                        <span className="text-sm font-medium">{witness.readinessScore}%</span>
                      </div>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-semibold">Case Documents</h2>
              <Link to="/documents/upload">
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </Link>
            </div>

            <Card className="border border-line border-dashed border-2">
              <CardContent className="p-12 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-subtle" />
                <h3 className="font-medium mb-2">Drag and drop files here</h3>
                <p className="text-subtle text-sm mb-4">
                  or click to browse for pleadings, statements, reports, and exhibits
                </p>
                <Button variant="outline">Choose Files</Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card className="border border-line">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-subtle" />
                      <div>
                        <h3 className="font-medium">Expert Technical Report</h3>
                        <p className="text-sm text-subtle">
                          Uploaded by Sarah Mitchell • Jan 9, 2025
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Processed</Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold">Case Analytics</h2>
              
              {/* Session Summary Banner */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Recent Session Analysis</h3>
                    <p className="text-sm text-blue-600">
                      AI suggestions generated from the latest court room session with Dr. Patricia Williams
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-line">
                <CardHeader>
                  <CardTitle>Witness Readiness Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ready (80%+)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-line rounded-full">
                          <div className="w-1/4 h-full bg-accent-ok rounded-full"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress (60-79%)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-line rounded-full">
                          <div className="w-1/2 h-full bg-accent-warn rounded-full"></div>
                        </div>
                        <span className="text-sm">50%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Risk (&lt;60%)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-line rounded-full">
                          <div className="w-1/4 h-full bg-accent-err rounded-full"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-line">
                <CardHeader>
                  <CardTitle>Overall Case Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-ink mb-2">{caseData.readinessScore}%</div>
                    <Sparkbar 
                      value={caseData.readinessScore} 
                      variant="success"
                      className="mb-4"
                    />
                    <p className="text-subtle text-sm">
                      Excellent progress. Case is well-prepared for hearing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI-Generated Suggestions Based on Case Discussion */}
            <Card className="border border-line">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  AI-Generated Suggestions
                </CardTitle>
                <CardDescription>
                  Recommendations based on the recent case discussion and witness performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent-ok/10 border border-accent-ok/20 rounded-lg">
                    <h4 className="font-semibold text-accent-ok mb-2">✅ Strengths Identified</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Dr. Williams demonstrated excellent technical knowledge and clarity</li>
                      <li>• Strong evidence presentation with supporting documentation</li>
                      <li>• Good composure under cross-examination pressure</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-accent-warn/10 border border-accent-warn/20 rounded-lg">
                    <h4 className="font-semibold text-accent-warn mb-2">⚠️ Areas for Improvement</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Consider preparing more concise responses to complex technical questions</li>
                      <li>• Practice handling rapid-fire questioning scenarios</li>
                      <li>• Review potential objections to expert testimony</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Strategic Recommendations</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Focus next session on strengthening weak points in the technical analysis</li>
                      <li>• Prepare additional exhibits to support key arguments</li>
                      <li>• Consider mock cross-examination with opposing counsel's likely questions</li>
                      <li>• Review case law precedents for similar commercial disputes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">📊 Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-subtle">Confidence Level:</span>
                        <span className="ml-2 font-medium text-accent-ok">85%</span>
                      </div>
                      <div>
                        <span className="text-subtle">Response Clarity:</span>
                        <span className="ml-2 font-medium text-accent-ok">92%</span>
                      </div>
                      <div>
                        <span className="text-subtle">Technical Accuracy:</span>
                        <span className="ml-2 font-medium text-accent-ok">88%</span>
                      </div>
                      <div>
                        <span className="text-subtle">Composure Score:</span>
                        <span className="ml-2 font-medium text-accent-warn">76%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-line">
              <CardHeader>
                <CardTitle>Export Case Report</CardTitle>
                <CardDescription>
                  Generate comprehensive readiness reports for client or court use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button variant="outline">Download PDF Report</Button>
                  <Button variant="outline">Export CSV Data</Button>
                  <Button variant="outline">Generate Court Summary</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
