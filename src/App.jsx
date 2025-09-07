import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import Witnesses from './pages/Witnesses';
import Documents from './pages/Documents';
import DocumentUpload from './pages/DocumentUpload';
import Resources from './pages/Resources';
import SessionWizard from './pages/SessionWizard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/case/:id" element={<CaseDetail />} />
      <Route path="/witnesses" element={<Witnesses />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/documents/upload" element={<DocumentUpload />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/session/new" element={<SessionWizard />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
