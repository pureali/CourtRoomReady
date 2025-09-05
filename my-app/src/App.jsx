import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/court_prep_logo.jpeg";

const COURT_AREAS = [
  "Criminal Law",
  "Civil Litigation",
  "Family Law",
  "Employment Law",
  "Immigration Law",
  "Intellectual Property",
  "Personal Injury",
  "Contract Dispute",
  "Property Law",
  "Other"
];

// Helper to generate a unique case ID
function generateCaseId() {
  return "CASE-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function SectionForm({ role, form, setForm }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        documents: Array.from(e.target.files),
      },
    }));
  };

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: 10,
      padding: 20,
      marginBottom: 32,
      background: "#fafbfc"
    }}>
      <h3 style={{ marginTop: 0 }}>{role} Section</h3>
      <label style={{ display: "block", marginBottom: 12 }}>
        Name:
        <input
          type="text"
          name="name"
          value={form[role].name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: 12 }}>
        Area of Legal Court Proceeding:
        <select
          name="area"
          value={form[role].area}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
        >
          <option value="" disabled>Select an area</option>
          {COURT_AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </label>
      <label style={{ display: "block", marginBottom: 12 }}>
        Details about the Case:
        <textarea
          name="details"
          value={form[role].details}
          onChange={handleChange}
          required
          rows={3}
          style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: 16 }}>
        Upload Supporting Documents:
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ marginTop: 4 }}
        />
      </label>
      {form[role].documents.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <strong>Files to upload:</strong>
          <ul>
            {form[role].documents.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    Witness: { name: "", area: "", details: "", documents: [] },
    Counsellor: { name: "", area: "", details: "", documents: [] }
  });
  const [activeTab, setActiveTab] = useState("Witness");
  const [submitted, setSubmitted] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showCourtRoom, setShowCourtRoom] = useState(false);
  const [lastCaseId, setLastCaseId] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      const caseId = generateCaseId();
      setSubmitted((prev) => [
        ...prev,
        {
          caseId,
          Witness: { ...form.Witness },
          Counsellor: { ...form.Counsellor }
        }
      ]);
      setLastCaseId(caseId);
      alert(`Application submitted!\nYour Case ID: ${caseId}`);
      setForm({
        Witness: { name: "", area: "", details: "", documents: [] },
        Counsellor: { name: "", area: "", details: "", documents: [] }
      });
      setShowCourtRoom(true);
    }, 1200);
  };

  const handleStartCourtRoom = async () => {
    // Prepare data for backend (excluding files for simplicity)
    const payload = {
      caseId: lastCaseId,
      witness: {
        name: submitted[submitted.length - 1].Witness.name,
        area: submitted[submitted.length - 1].Witness.area,
        details: submitted[submitted.length - 1].Witness.details
      },
      counsellor: {
        name: submitted[submitted.length - 1].Counsellor.name,
        area: submitted[submitted.length - 1].Counsellor.area,
        details: submitted[submitted.length - 1].Counsellor.details
      }
    };

    try {
      await fetch("http://localhost:8000/api/new_application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      navigate("/room", { state: { caseId: lastCaseId } });
    } catch (err) {
      alert("Failed to start virtual court room. Please try again.");
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      background: "#fff"
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img src={logo} alt="CourtRoomReady Logo" style={{ width: 80, marginBottom: 12 }} />
        <h2>CourtRoomReady Application</h2>
        <p>Witness and Counsellor can submit their details for the case.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setActiveTab("Witness")}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              borderBottom: activeTab === "Witness" ? "3px solid #2d5be3" : "1px solid #ccc",
              background: activeTab === "Witness" ? "#f6f8fa" : "#fff",
              color: activeTab === "Witness" ? "#2d5be3" : "#333",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
              borderTopLeftRadius: 8,
            }}
          >
            Witness
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Counsellor")}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              borderBottom: activeTab === "Counsellor" ? "3px solid #2d5be3" : "1px solid #ccc",
              background: activeTab === "Counsellor" ? "#f6f8fa" : "#fff",
              color: activeTab === "Counsellor" ? "#2d5be3" : "#333",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
              borderTopRightRadius: 8,
            }}
          >
            Counsellor
          </button>
        </div>
        {activeTab === "Witness" && (
          <SectionForm role="Witness" form={form} setForm={setForm} />
        )}
        {activeTab === "Counsellor" && (
          <SectionForm role="Counsellor" form={form} setForm={setForm} />
        )}
        <button
          type="submit"
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 6,
            border: "none",
            background: "#2d5be3",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            cursor: uploading ? "not-allowed" : "pointer",
            marginTop: 8
          }}
        >
          {uploading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
      {submitted.length > 0 && (
        <div style={{
          marginTop: 32,
          padding: 16,
          background: "#f6f8fa",
          borderRadius: 8,
          border: "1px solid #e0e0e0"
        }}>
          <h4>Submitted Applications</h4>
          <ul>
            {submitted.map((app, idx) => (
              <li key={app.caseId}>
                <strong>Case ID:</strong> {app.caseId}<br />
                <strong>Witness:</strong> {app.Witness.name}<br />
                <strong>Counsellor:</strong> {app.Counsellor.name}
              </li>
            ))}
          </ul>
          <small>Use your Case ID for further correspondence.</small>
          {showCourtRoom && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={handleStartCourtRoom}
                style={{
                  padding: "12px 32px",
                  borderRadius: 8,
                  border: "none",
                  background: "#27ae60",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  cursor: "pointer"
                }}
              >
                Start Virtual Court Room
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}