import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const MenuContainer = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.3)' : 'rgba(0, 100, 200, 0.3)'};
  border-radius: 12px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 200px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.1)' : 'rgba(0, 85, 255, 0.05)'};
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.2)' : 'rgba(0, 85, 255, 0.1)'};
    border-color: ${props => props.$isDark ? 'rgba(0, 200, 255, 0.5)' : 'rgba(0, 120, 200, 0.5)'};
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
`;

const DownloadOptions = ({ onDownloadPNG, onDownloadPDF, onDownloadPPT }) => {
  const { isDark } = useTheme();

  return (
    <MenuContainer $isDark={isDark}>
      <MenuItem $isDark={isDark} onClick={onDownloadPNG}>
        🖼️ Download as PNG
      </MenuItem>
      <MenuItem $isDark={isDark} onClick={onDownloadPDF}>
        📄 Download as PDF
      </MenuItem>
      <MenuItem $isDark={isDark} onClick={onDownloadPPT}>
        📊 Download as PPT
      </MenuItem>
    </MenuContainer>
  );
};

export default DownloadOptions;
