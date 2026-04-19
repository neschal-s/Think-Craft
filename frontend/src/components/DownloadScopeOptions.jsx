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
  min-width: 220px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DownloadScopeOptions = ({ onSelectSlide, onSelectAll, onBack }) => {
  const { isDark } = useTheme();

  return (
    <MenuContainer $isDark={isDark}>
      <Title $isDark={isDark}>Download Format</Title>
      <ButtonWrapper>
        <CompactButton
          $isDark={isDark}
          onClick={onSelectSlide}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Download Current Slide
        </CompactButton>
        <CompactButton
          $isDark={isDark}
          onClick={onSelectAll}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Download All Slides
        </CompactButton>
        <CompactButton
          $isDark={isDark}
          onClick={onBack}
          style={{ width: '100%', marginTop: '4px' }}
        >
          Back
        </CompactButton>
      </ButtonWrapper>
    </MenuContainer>
  );
};

export default DownloadScopeOptions;
