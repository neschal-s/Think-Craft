import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PanelContainer = styled.div`
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

const TextInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  font-size: 14px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.3)' : 'rgba(0, 100, 200, 0.3)'};
  border-radius: 8px;
  background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.15)' : 'rgba(0, 85, 255, 0.1)'};
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.25)' : 'rgba(0, 85, 255, 0.15)'};
    border-color: #0055ff;
  }

  &:active {
    transform: scale(0.98);
  }

  &.cancel {
    background: ${props => props.$isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'};
    color: ${props => props.$isDark ? '#fca5a5' : '#ef4444'};
    border-color: ${props => props.$isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)'};

    &:hover {
      background: ${props => props.$isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)'};
    }
  }
`;

const EditSlidePanel = ({ 
  slideNumber, 
  headline, 
  body, 
  onHeadlineChange, 
  onBodyChange, 
  onSave, 
  onCancel 
}) => {
  const { isDark } = useTheme();

  return (
    <PanelContainer $isDark={isDark}>
      <div className="space-y-4">
        <h3 className={`font-semibold text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
          ✏️ Edit Slide {slideNumber}
        </h3>

        <div>
          <Label $isDark={isDark}>Headline</Label>
          <TextInput
            type="text"
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            placeholder="Enter slide headline..."
            $isDark={isDark}
          />
        </div>

        <div>
          <Label $isDark={isDark}>Body Text</Label>
          <TextArea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Enter slide body text..."
            $isDark={isDark}
          />
        </div>

        <ButtonGroup>
          <Button onClick={onSave} $isDark={isDark}>
            ✓ Save Changes
          </Button>
          <Button onClick={onCancel} className="cancel" $isDark={isDark}>
            ✕ Cancel
          </Button>
        </ButtonGroup>
      </div>
    </PanelContainer>
  );
};

export default EditSlidePanel;
