import React from 'react';

const FormatSelector = ({ selectedFormat, onFormatChange, loading }) => {
  const formats = [
    { id: '1:1', label: 'Square', icon: '⬜', description: 'Instagram Feed', ratio: '1:1' },
    { id: '9:16', label: 'Vertical', icon: '📱', description: 'Instagram Stories & Reels', ratio: '9:16' },
    { id: '16:9', label: 'Horizontal', icon: '🎬', description: 'YouTube & LinkedIn', ratio: '16:9' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Format</h3>
        <p className="text-slate-400 text-sm">Optimize your carousel for different platforms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            disabled={loading}
            className={`relative p-5 rounded-xl border-2 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedFormat === format.id
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
            }`}
          >
            <div className="text-3xl mb-3">{format.icon}</div>
            <div className="text-left">
              <h4 className="text-white font-bold text-lg">{format.label}</h4>
              <p className="text-slate-400 text-xs mb-2">{format.ratio}</p>
              <p className="text-slate-500 text-xs">{format.description}</p>
            </div>
            {selectedFormat === format.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-slate-900 text-sm font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300 text-sm flex items-center gap-2">
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
