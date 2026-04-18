import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SelectionButton } from '../styles/ModernButtons';

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
        <h3 className={`font-['Orbitron'] text-xl font-bold ${theme.colors.text.primary} mb-1 tracking-wide`}>Choose Your Format</h3>
        <p className={`font-['Inter'] ${theme.colors.text.tertiary} text-sm font-normal`}>Change aspect ratio instantly - content stays the same</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((format) => (
          <SelectionButton
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            $isDark={isDark}
            $isSelected={selectedFormat === format.id}
          >
            <div className="text-left">
              <h4 className={`font-bold text-lg`}>{format.label}</h4>
              <p className={`${theme.colors.text.tertiary} text-xs mb-2`}>{format.ratio}</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{format.description}</p>
            </div>
            {selectedFormat === format.id && (
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-400 text-slate-900' : 'bg-blue-600 text-white'}`}>
                <span className="text-sm font-bold">✓</span>
              </div>
            )}
          </SelectionButton>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
