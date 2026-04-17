import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FormatSelector = ({ selectedFormat, onFormatChange, loading }) => {
  const { isDark, theme } = useTheme();

  const formats = [
    { id: '1:1', label: 'Square', description: 'Instagram Feed', ratio: '1:1' },
    { id: '9:16', label: 'Vertical', description: 'Instagram Stories & Reels', ratio: '9:16' },
    { id: '16:9', label: 'Horizontal', description: 'YouTube & LinkedIn', ratio: '16:9' },
  ];

  return (
    <div className={`${theme.colors.bg.card} rounded-xl border ${theme.colors.border} p-6 shadow-xl transition-colors duration-300`}>
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${theme.colors.text.primary} mb-1`}>Choose Your Format</h3>
        <p className={`${theme.colors.text.tertiary} text-sm`}>Optimize your carousel for different platforms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            disabled={loading}
            className={`relative p-5 rounded-xl border-2 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedFormat === format.id
                ? isDark
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                  : 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-200'
                : isDark
                  ? 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            <div className="text-left">
              <h4 className={`font-bold text-lg ${theme.colors.text.primary}`}>{format.label}</h4>
              <p className={`${theme.colors.text.tertiary} text-xs mb-2`}>{format.ratio}</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{format.description}</p>
            </div>
            {selectedFormat === format.id && (
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-400 text-slate-900' : 'bg-blue-600 text-white'}`}>
                <span className="text-sm font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${isDark ? 'bg-blue-900/30 border border-blue-700 text-blue-300' : 'bg-blue-50 border border-blue-300 text-blue-700'}`}>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Adapting carousel to new format...</span>
        </div>
      )}
    </div>
  );
};

export default FormatSelector;
