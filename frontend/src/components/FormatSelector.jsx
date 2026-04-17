import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FormatSelector = ({ selectedFormat, onFormatChange }) => {
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
        <p className={`${theme.colors.text.tertiary} text-sm`}>Change aspect ratio instantly - content stays the same</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            className={`relative p-5 rounded-xl border-2 transition duration-200 transform hover:scale-105 ${
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
    </div>
  );
};

export default FormatSelector;
