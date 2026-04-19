import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PanelContainer = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 12px;
  padding: 20px;
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDark ? '#1a1d25' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, rgba(0, 85, 255, 0.2) 0%, rgba(0, 170, 255, 0.2) 100%)'
    : props.$isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  color: ${props => props.$primary 
    ? '#0088ff'
    : props.$isDark ? '#cbd5e1' : '#475569'};
  border: 2px solid ${props => props.$primary 
    ? 'rgba(0, 85, 255, 0.4)' 
    : props.$isDark ? 'rgba(100, 116, 139, 0.4)' : 'rgba(150, 160, 170, 0.4)'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.$primary 
      ? 'linear-gradient(135deg, rgba(0, 85, 255, 0.3) 0%, rgba(0, 170, 255, 0.3) 100%)'
      : props.$isDark ? 'rgba(40, 50, 70, 0.7)' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: ${props => props.$isDark ? '#8a8d93' : '#8b5cf6'};
  margin-top: 8px;
`;

const TonePromptAdjustment = ({ 
  currentPrompt, 
  currentTone,
  onRegenerateWithChanges, 
  onCancel,
  isLoading 
}) => {
  const { isDark } = useTheme();
  const [newPrompt, setNewPrompt] = useState(currentPrompt);
  const [newTone, setNewTone] = useState(currentTone);

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'creative', label: 'Creative' },
  ];

  const handleRegenerate = () => {
    onRegenerateWithChanges(newPrompt, newTone);
  };

  const promptChanged = newPrompt !== currentPrompt;
  const toneChanged = newTone !== currentTone;

  return (
    <PanelContainer $isDark={isDark}>
      <div className="space-y-4">
        <div>
          <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
            🔄 Adjust & Regenerate
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'} mb-4`}>
            Modify your prompt or change the tone, then regenerate the carousel with new content.
          </p>
        </div>

        <div>
          <Label $isDark={isDark}>📝 Carousel Prompt</Label>
          <TextArea
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Describe what you want the carousel to be about..."
            $isDark={isDark}
          />
          {promptChanged && <InfoText $isDark={isDark}>✓ Prompt will be regenerated</InfoText>}
        </div>

        <div>
          <Label $isDark={isDark}>🎯 Tone & Style</Label>
          <Select
            value={newTone}
            onChange={(e) => setNewTone(e.target.value)}
            $isDark={isDark}
          >
            {tones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
          {toneChanged && <InfoText $isDark={isDark}>✓ Tone will be regenerated</InfoText>}
        </div>

        {!promptChanged && !toneChanged && (
          <InfoText $isDark={isDark}>💡 Make changes to prompt or tone to regenerate</InfoText>
        )}

        <ButtonGroup>
          <Button 
            onClick={handleRegenerate} 
            $primary 
            $isDark={isDark}
            disabled={isLoading || (!promptChanged && !toneChanged)}
          >
            {isLoading ? '⏳ Regenerating...' : '🚀 Regenerate Carousel'}
          </Button>
          <Button onClick={onCancel} $isDark={isDark} disabled={isLoading}>
            ✕ Cancel
          </Button>
        </ButtonGroup>
      </div>
    </PanelContainer>
  );
};

export default TonePromptAdjustment;
