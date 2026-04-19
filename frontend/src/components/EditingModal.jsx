import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { googleFonts, formatFontForCSS } from '../utils/fontLoader';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.$isDark ? '#0f1115' : '#ffffff'};
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.1)'};
`;

const SlidePreviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: ${props => props.$isDark ? 'rgba(10, 10, 15, 0.5)' : 'rgba(245, 245, 250, 0.5)'};
  overflow-y: auto;
`;

const SlidePreviewContainer = styled.div`
  width: 100%;
  max-width: 500px;
  aspect-ratio: ${props => props.$aspectRatio || '1/1'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const SlideContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-image: url("${props => props.$imageUrl}");
  background-size: cover;
  background-position: center;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%);
`;

const TextContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ToolsPanel = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
  border-left: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.1)' : 'rgba(0, 100, 200, 0.1)'};
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ToolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  margin: 0;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
`;

const TextInput = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 6px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  font-size: 12px;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #0055ff;
    box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 6px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #0055ff;
    box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px;
  border: 2px solid ${props => props.$primary ? '#0055ff' : props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 6px;
  background: ${props => props.$primary ? 'rgba(0, 85, 255, 0.15)' : props.$isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.$primary ? '#0088ff' : props.$isDark ? '#cbd5e1' : '#475569'};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;

  &:hover {
    background: ${props => props.$primary ? 'rgba(0, 85, 255, 0.25)' : props.$isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.$isDark ? '#cbd5e1' : '#475569'};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(26, 29, 37, 1)' : 'rgba(255, 255, 255, 1)'};
    border-color: #0055ff;
  }
`;

const EditingModal = ({
  isOpen,
  onClose,
  currentSlide,
  slides,
  headingFont,
  bodyFont,
  editingHeadline,
  editingBody,
  onHeadlineChange,
  onBodyChange,
  onFontChange,
  onSave,
  selectedFormat,
}) => {
  const { isDark, theme } = useTheme();
  const [selectedHeadingFont, setSelectedHeadingFont] = useState(headingFont);
  const [selectedBodyFont, setSelectedBodyFont] = useState(bodyFont);

  const aspectRatios = {
    '1:1': '1/1',
    '4:5': '4/5',
    '9:16': '9/16',
    '16:9': '16/9',
  };

  const handleHeadingFontChange = (font) => {
    setSelectedHeadingFont(font);
    onFontChange('heading', font);
  };

  const handleBodyFontChange = (font) => {
    setSelectedBodyFont(font);
    onFontChange('body', font);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $isDark={isDark} onClick={(e) => e.stopPropagation()}>
        <CloseButton $isDark={isDark} onClick={onClose}>✕</CloseButton>

        {/* Left Side: Live Preview */}
        <SlidePreviewPanel>
          <SlidePreviewContainer $aspectRatio={aspectRatios[selectedFormat]}>
            <SlideContent $imageUrl={currentSlide?.imageUrl || ''}>
              <Overlay />
              <TextContent>
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: formatFontForCSS(selectedHeadingFont),
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    margin: 0,
                  }}
                >
                  {editingHeadline || currentSlide?.headline}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: formatFontForCSS(selectedBodyFont),
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    margin: 0,
                    lineHeight: '1.4',
                  }}
                >
                  {editingBody || currentSlide?.body}
                </p>
              </TextContent>
            </SlideContent>
          </SlidePreviewContainer>
        </SlidePreviewPanel>

        {/* Right Side: Editing Tools */}
        <ToolsPanel>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#ffffff' : '#111215', margin: '0 0 15px 0' }}>
              Edit Slide {slides.indexOf(currentSlide) + 1}
            </h2>
          </div>

          {/* Text Editing */}
          <ToolSection>
            <SectionTitle $isDark={isDark}>📝 Text</SectionTitle>
            <div>
              <Label $isDark={isDark}>Headline</Label>
              <TextInput
                value={editingHeadline}
                onChange={(e) => onHeadlineChange(e.target.value)}
                placeholder="Enter headline..."
                $isDark={isDark}
                style={{ minHeight: '50px' }}
              />
            </div>
            <div>
              <Label $isDark={isDark}>Body</Label>
              <TextInput
                value={editingBody}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="Enter body text..."
                $isDark={isDark}
              />
            </div>
          </ToolSection>

          {/* Font Selection */}
          <ToolSection>
            <SectionTitle $isDark={isDark}>Fonts</SectionTitle>
            <div>
              <Label $isDark={isDark}>Heading Font</Label>
              <Select
                value={selectedHeadingFont}
                onChange={(e) => handleHeadingFontChange(e.target.value)}
                $isDark={isDark}
              >
                {googleFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label $isDark={isDark}>Body Font</Label>
              <Select
                value={selectedBodyFont}
                onChange={(e) => handleBodyFontChange(e.target.value)}
                $isDark={isDark}
              >
                {googleFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </Select>
            </div>
          </ToolSection>

          {/* Action Buttons */}
          <ToolSection>
            <ButtonGroup>
              <Button $primary $isDark={isDark} onClick={onSave}>
                ✓ Save
              </Button>
              <Button $isDark={isDark} onClick={onClose}>
                ✕ Close
              </Button>
            </ButtonGroup>
          </ToolSection>
        </ToolsPanel>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditingModal;
