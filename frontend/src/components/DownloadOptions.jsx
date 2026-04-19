import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { CompactButton } from '../styles/ModernButtons';

const MenuContainer = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.3)' : 'rgba(0, 100, 200, 0.3)'};
  border-radius: 12px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 200px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DownloadOptions = ({ onDownloadPNG, onDownloadPDF, onDownloadPPT, onBack, hasBack }) => {
  const { isDark } = useTheme();

  return (
    <MenuContainer $isDark={isDark}>
      <ButtonWrapper>
        <CompactButton
          $isDark={isDark}
          onClick={onDownloadPNG}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Download as PNG
        </CompactButton>
        <CompactButton
          $isDark={isDark}
          onClick={onDownloadPDF}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Download as PDF
        </CompactButton>
        <CompactButton
          $isDark={isDark}
          onClick={onDownloadPPT}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Download as PPT
        </CompactButton>
        {hasBack && (
          <CompactButton
            $isDark={isDark}
            onClick={onBack}
            style={{ width: '100%', marginTop: '4px' }}
          >
            Back
          </CompactButton>
        )}
      </ButtonWrapper>
    </MenuContainer>
  );
};

export default DownloadOptions;
