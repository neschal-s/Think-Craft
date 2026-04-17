import React from 'react';

const FormatSelector = ({ selectedFormat, onFormatChange, loading }) => {
  const formats = ['1:1', '9:16', '16:9'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Format</h3>
      <div className="grid grid-cols-3 gap-4">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => onFormatChange(format)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 font-semibold transition ${
              selectedFormat === format
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-300 text-gray-600 hover:border-primary-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {format}
            <span className="block text-xs mt-1 font-normal">
              {format === '1:1' ? 'Square' : format === '9:16' ? 'Vertical' : 'Horizontal'}
            </span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Select a format to generate carousels optimized for different social media platforms.
      </p>
    </div>
  );
};

export default FormatSelector;
