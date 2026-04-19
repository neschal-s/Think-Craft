import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { googleFonts, formatFontForCSS } from '../utils/fontLoader';

const SelectorContainer = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  font-family: ${props => `"${props.$fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(100, 220, 255, 0.5)' : 'rgba(0, 120, 200, 0.5)'};
  }

  &:focus {
    outline: none;
    border-color: #0055ff;
    box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
  }
`;

const Preview = styled.div`
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.$isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
  font-family: ${props => `"${props.$fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`};
  font-size: 14px;
  color: ${props => props.$isDark ? '#cbd5e1' : '#475569'};
  text-align: center;
`;

const FontSelector = ({ headingFont, bodyFont, onHeadingFontChange, onBodyFontChange }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4">
      <SelectorContainer $isDark={isDark}>
        <Label $isDark={isDark}>Heading Font</Label>
        <Select
          value={headingFont}
          onChange={(e) => onHeadingFontChange(e.target.value)}
          $fontFamily={headingFont}
          $isDark={isDark}
        >
          {googleFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
        <Preview $fontFamily={headingFont} $isDark={isDark}>
          "Your Stunning Headline"
        </Preview>
      </SelectorContainer>

      <SelectorContainer $isDark={isDark}>
        <Label $isDark={isDark}>📄 Body Text Font</Label>
        <Select
          value={bodyFont}
          onChange={(e) => onBodyFontChange(e.target.value)}
          $fontFamily={bodyFont}
          $isDark={isDark}
        >
          {googleFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
        <Preview $fontFamily={bodyFont} $isDark={isDark}>
          This is how your paragraph text will look with this font.
        </Preview>
      </SelectorContainer>
    </div>
  );
};

export default FontSelector;
