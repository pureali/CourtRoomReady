import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Witnesses from './pages/Witnesses';
import Documents from './pages/Documents';
import Resources from './pages/Resources';
import SessionWizard from './pages/SessionWizard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/witnesses" element={<Witnesses />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/session/new" element={<SessionWizard />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
