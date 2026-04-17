import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage';
import ViewerPage from './pages/ViewerPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-700 sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ThinkCraft
              </h1>
            </div>
            <p className="text-slate-400 text-sm hidden sm:block">AI-Powered Social Media Carousels</p>
          </div>
        </header>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/viewer" element={<ViewerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
