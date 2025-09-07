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
  Play,
  Video,
  Mic,
  MonitorSpeaker,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SessionWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWitness, setSelectedWitness] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const witnesses = [
    { id: 1, name: "Dr. Patricia Williams", case: "Meridian v TechCorp", readiness: 84 },
    { id: 2, name: "Mark Stevens", case: "Blackstone Financial", readiness: 67 },
    { id: 3, name: "Jennifer Liu", case: "Global Logistics", readiness: 55 },
    { id: 4, name: "Robert Chen", case: "Healthcare Systems", readiness: 72 }
  ];

  const modes = [
    { id: "cross", name: "Cross-examination", description: "Challenge testimony and test credibility" },
    { id: "direct", name: "Direct examination", description: "Elicit testimony from your own witness" },
    { id: "expert", name: "Expert presentation", description: "Present expert opinion and analysis" }
  ];

  const steps = [
    { id: 1, name: "Choose Witness", completed: currentStep > 1 },
    { id: 2, name: "Select Mode", completed: currentStep > 2 },
    { id: 3, name: "Device Check", completed: currentStep > 3 },
    { id: 4, name: "Launch Session", completed: false }
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStartSession = () => {
    try {
      console.log("Start Session button clicked!");
      
      // Navigate to court room with session data
      const selectedWitnessData = witnesses.find(w => w.name === selectedWitness);
      const selectedModeData = modes.find(m => m.id === selectedMode);
      
      console.log("Selected witness:", selectedWitness);
      console.log("Selected mode:", selectedMode);
      console.log("Selected witness data:", selectedWitnessData);
      console.log("Selected mode data:", selectedModeData);
      
      const params = new URLSearchParams({
        fullName: "Alexandra Reid",
        caseType: selectedWitnessData?.case || "New Session",
        caseDescription: `Session with ${selectedWitness} - ${selectedModeData?.name}`,
        witness: selectedWitness,
        mode: selectedModeData?.name
      });
      
      const redirectUrl = `${window.location.origin}/court_room.html?${params.toString()}`;
      console.log("Redirecting to:", redirectUrl);
      
      // Try multiple redirect methods
      try {
        // Method 1: window.location.href
        window.location.href = redirectUrl;
      } catch (error) {
        console.log("Method 1 failed, trying Method 2");
        try {
          // Method 2: window.location.assign
          window.location.assign(redirectUrl);
        } catch (error2) {
          console.log("Method 2 failed, trying Method 3");
          // Method 3: window.open
          window.open(redirectUrl, '_self');
        }
      }
    } catch (error) {
      console.error("Error in handleStartSession:", error);
      alert("Error starting session. Please try again.");
    }
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
          <span className="text-ink font-medium">Start New Session</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-ink">Start New Session</h1>
            <p className="text-sm text-subtle">Set up a new witness preparation session</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.completed ? "bg-accent-ok text-surface" :
                currentStep === step.id ? "bg-ink text-surface" :
                "bg-line text-subtle"
              }`}>
                {step.id}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === step.id ? "text-ink font-medium" : "text-subtle"
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step.completed ? "bg-accent-ok" : "bg-line"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-surface border border-line">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-ink">Choose Witness</h2>
                <div className="grid grid-cols-1 gap-4">
                  {witnesses.map((witness) => (
                    <div
                      key={witness.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedWitness === witness.name 
                          ? "border-accent-ok bg-accent-ok/5" 
                          : "border-line hover:border-accent-ok/50"
                      }`}
                      onClick={() => setSelectedWitness(witness.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-ink">{witness.name}</h3>
                          <p className="text-sm text-subtle">{witness.case}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            witness.readiness >= 80 ? "text-accent-ok bg-accent-ok/10" :
                            witness.readiness >= 60 ? "text-accent-warn bg-accent-warn/10" :
                            "text-accent-err bg-accent-err/10"
                          }`}>
                            {witness.readiness}% ready
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-ink">Select Mode</h2>
                <div className="grid grid-cols-1 gap-4">
                  {modes.map((mode) => (
                    <div
                      key={mode.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMode === mode.id 
                          ? "border-accent-ok bg-accent-ok/5" 
                          : "border-line hover:border-accent-ok/50"
                      }`}
                      onClick={() => setSelectedMode(mode.id)}
                    >
                      <h3 className="font-medium text-ink mb-1">{mode.name}</h3>
                      <p className="text-sm text-subtle">{mode.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-ink">Device Check</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-line p-4 text-center">
                    <Video className="h-8 w-8 text-accent-ok mx-auto mb-2" />
                    <h3 className="font-medium text-ink">Camera</h3>
                    <p className="text-sm text-accent-ok">Working</p>
                  </Card>
                  <Card className="border border-line p-4 text-center">
                    <Mic className="h-8 w-8 text-accent-ok mx-auto mb-2" />
                    <h3 className="font-medium text-ink">Microphone</h3>
                    <p className="text-sm text-accent-ok">Working</p>
                  </Card>
                  <Card className="border border-line p-4 text-center">
                    <MonitorSpeaker className="h-8 w-8 text-accent-ok mx-auto mb-2" />
                    <h3 className="font-medium text-ink">Speakers</h3>
                    <p className="text-sm text-accent-ok">Working</p>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="p-8">
                  <Play className="h-16 w-16 text-accent-ok mx-auto mb-4" />
                  <h2 className="text-lg font-heading font-semibold text-ink mb-2">Ready to Launch</h2>
                  <p className="text-subtle mb-4">
                    Session with {selectedWitness} - {modes.find(m => m.id === selectedMode)?.name}
                  </p>
                  <Button 
                    onClick={handleStartSession}
                    className="bg-accent-ok hover:bg-accent-ok/90 text-surface text-lg px-8 py-3"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Session
                  </Button>
                  
                  {/* Fallback button for testing */}
                  <div className="mt-4">
                    <button 
                      onClick={() => {
                        console.log("Fallback button clicked");
                        window.location.href = "/court_room.html";
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Test Direct Redirect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-line text-slate hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedWitness) ||
                (currentStep === 2 && !selectedMode)
              }
              className="bg-accent-ok hover:bg-accent-ok/90 text-surface"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
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
