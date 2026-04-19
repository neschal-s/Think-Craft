import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage';
import ViewerPage from './pages/ViewerPage';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { IconButton } from './styles/ModernButtons';
import './index.css';

function AppContent() {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 bg-transparent`}>
        {/* Header */}
        <header className={`border-b ${theme.colors.border} sticky top-0 z-50 ${isDark ? 'bg-[#0f1115]/95' : 'bg-white/70'} backdrop-blur-md transition-colors duration-300 shadow-sm`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* < className="flex items-center gap-3"> */}
                    
              <h1 className={`font-['Orbitron'] text-2xl font-bold bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent tracking-wide`}>
                ThinkCraft
              </h1>
            {/* </div> */}
            <div className="flex items-center gap-4">
              <p className={`font-['Inter'] text-sm hidden sm:block ${theme.colors.text.tertiary} font-normal`}>AI-Powered Social Media Carousels</p>
              <IconButton
                onClick={toggleTheme}
                $isDark={isDark}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414zm2.121-10.607a1 1 0 010 1.414L11.586 9.5a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-1.414 1.414a1 1 0 00-1.414-1.414zm5.657-9.193a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </IconButton>
            </div>
          </div>
        </header>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/viewer" element={<ViewerPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
