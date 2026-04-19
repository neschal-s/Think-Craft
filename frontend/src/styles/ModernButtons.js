import styled, { keyframes } from 'styled-components';

// Keyframe animations
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    box-shadow: 0 0 15px rgba(0, 150, 255, 0.5), inset 0 0 15px rgba(0, 150, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 150, 255, 0.7), inset 0 0 25px rgba(0, 150, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 150, 255, 0.5), inset 0 0 15px rgba(0, 150, 255, 0.1);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(0, 85, 255, 0.6)) drop-shadow(0 0 16px rgba(0, 200, 255, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(0, 85, 255, 0.8)) drop-shadow(0 0 24px rgba(0, 200, 255, 0.5));
  }
`;

const orangeGlowPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 85, 0, 0.6)) drop-shadow(0 0 20px rgba(255, 100, 0, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(255, 110, 20, 0.8)) drop-shadow(0 0 32px rgba(255, 85, 0, 0.6));
  }
`;

const neonBorder = keyframes`
  0%, 100% {
    border-color: rgba(0, 85, 255, 0.5);
    box-shadow: 0 0 10px rgba(0, 85, 255, 0.3), inset 0 0 10px rgba(0, 85, 255, 0.1);
  }
  50% {
    border-color: rgba(0, 85, 255, 0.8);
    box-shadow: 0 0 20px rgba(0, 85, 255, 0.5), inset 0 0 15px rgba(0, 85, 255, 0.2);
  }
`;

// Base modern button
export const ModernButton = styled.button`
  position: relative;
  padding: 12px 28px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  /* Glassmorphism effect */
  background: ${props => props.$isDark 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Soft shadows for light mode */
  box-shadow: ${props => props.$isDark 
    ? '0 4px 15px rgba(0, 100, 200, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.06)'};
  
  /* Default text color */
  color: ${props => props.$isDark ? '#ffffff' : '#111215'};
  
  /* Subtle border */
  border: 2px solid ${props => props.$isDark 
    ? 'rgba(100, 200, 255, 0.2)' 
    : 'rgba(0, 100, 200, 0.2)'};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
  
  &:hover:not(:disabled) {
    animation: ${glowPulse} 2s ease-in-out infinite;
    transform: translateY(-2px);
    border-color: ${props => props.$isDark 
      ? 'rgba(100, 220, 255, 0.5)' 
      : 'rgba(0, 120, 200, 0.5)'};
    box-shadow: ${props => props.$isDark 
      ? '0 8px 20px rgba(0, 150, 255, 0.4)' 
      : '0 8px 16px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0px);
    animation: none;
    box-shadow: inset 0 0 20px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.3)' 
      : 'rgba(255, 100, 0, 0.25)'}, 0 0 25px ${props => props.$isDark 
      ? 'rgba(255, 120, 0, 0.4)' 
      : 'rgba(255, 100, 0, 0.3)'};
  }
  
  /* Icon spacing */
  svg {
    margin-right: 8px;
    vertical-align: middle;
  }
`;

// Primary CTA Button (vibrant cyan-to-blue gradient with orange on click)
export const PrimaryButton = styled(ModernButton)`
  background: linear-gradient(135deg, rgba(0, 85, 255, 0.15) 0%, rgba(0, 170, 255, 0.15) 100%);
  
  border: 2px solid rgba(0, 85, 255, 0.3);
  
  color: #0088ff;
  
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      #0055ff 0%,
      #00aaff 100%
    );
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
  }
  
  &:hover:not(:disabled) {
    &::before {
      opacity: 0.1;
    }
    color: #00d9ff;
  }
  
  &:active:not(:disabled) {
    &::before {
      opacity: 0.2;
    }
    box-shadow: inset 0 0 30px rgba(255, 85, 0, 0.4), 0 0 30px rgba(255, 85, 0, 0.5);
  }
`;

// Secondary Button (muted, elegant)
export const SecondaryButton = styled(ModernButton)`
  background: rgba(26, 29, 37, 0.6);
  
  border: 2px solid rgba(42, 45, 53, 0.6);
  
  color: #b0b3b8;
  
  &:hover:not(:disabled) {
    background: rgba(37, 42, 53, 0.7);
    border-color: rgba(0, 85, 255, 0.4);
    color: #ffffff;
  }

  &:active:not(:disabled) {
    box-shadow: inset 0 0 20px rgba(255, 85, 0, 0.3), 0 0 25px rgba(255, 85, 0, 0.4);
  }
`;

// Success Button (green accent)
export const SuccessButton = styled(ModernButton)`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%);
  
  border: 2px solid rgba(74, 222, 128, 0.3);
  
  color: #86efac;
  
  &:hover:not(:disabled) {
    border-color: rgba(134, 239, 172, 0.6);
    color: #bbf7d0;
    animation: ${glowPulse} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 16px rgba(74, 222, 128, 0.2));
  }
`;

// Warning Button (electric orange accent)
export const WarningButton = styled(ModernButton)`
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.15) 0%, rgba(255, 110, 0, 0.15) 100%);
  
  border: 2px solid rgba(255, 110, 0, 0.3);
  
  color: #ff8c34;
  
  &:hover:not(:disabled) {
    border-color: rgba(255, 110, 0, 0.6);
    color: #ffaa55;
    filter: drop-shadow(0 0 8px rgba(255, 110, 0, 0.4)) drop-shadow(0 0 16px rgba(255, 110, 0, 0.2));
  }
`;

// Danger Button (red accent)
export const DangerButton = styled(ModernButton)`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
  
  border: 2px solid rgba(248, 113, 113, 0.3);
  
  color: #f87171;
  
  &:hover:not(:disabled) {
    border-color: rgba(248, 113, 113, 0.6);
    color: #fca5a5;
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 16px rgba(239, 68, 68, 0.2));
  }
`;

// Icon Button (smaller, circular)
export const IconButton = styled(ModernButton)`
  padding: 10px 10px;
  border-radius: 8px;
  width: auto;
  min-width: 40px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

// Full Width Button
export const FullWidthButton = styled(PrimaryButton)`
  width: 100%;
  padding: 14px 24px;
`;

// Full Width Success Button
export const FullWidthSuccessButton = styled(SuccessButton)`
  width: 100%;
  padding: 14px 24px;
`;

// Compact Button
export const CompactButton = styled(ModernButton)`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
`;

// Selection Button (for choosing options like tone, format)
export const SelectionButton = styled(ModernButton)`
  padding: 16px 20px;
  background: ${props => props.$isSelected
    ? props.$isDark
      ? 'linear-gradient(135deg, rgba(34, 197, 255, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'
      : 'linear-gradient(135deg, rgba(100, 220, 255, 0.3) 0%, rgba(100, 150, 255, 0.3) 100%)'
    : props.$isDark
      ? 'rgba(30, 41, 59, 0.7)'
      : 'rgba(255, 255, 255, 0.7)'};
  
  border: 2px solid ${props => props.$isSelected
    ? props.$isDark 
      ? 'rgba(100, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.6)'
    : props.$isDark 
      ? 'rgba(100, 116, 139, 0.4)' 
      : 'rgba(150, 160, 170, 0.4)'};
  
  color: ${props => props.$isSelected
    ? props.$isDark 
      ? '#00ffff' 
      : '#0066cc'
    : props.$isDark 
      ? '#cbd5e1' 
      : '#475569'};
  
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    border-color: ${props => props.$isDark 
      ? 'rgba(100, 220, 255, 0.7)' 
      : 'rgba(0, 120, 200, 0.7)'};
  }

  &:active:not(:disabled) {
    box-shadow: inset 0 0 20px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.3)' 
      : 'rgba(255, 100, 0, 0.25)'}, 0 0 25px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.4)' 
      : 'rgba(255, 100, 0, 0.3)'};
  }
`;

// Color Palette Button (square)
export const ColorPaletteButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$isDark 
      ? 'linear-gradient(135deg, rgba(0, 200, 255, 0.1), rgba(100, 150, 255, 0.1))' 
      : 'linear-gradient(135deg, rgba(0, 150, 255, 0.08), rgba(100, 200, 255, 0.08))'};
    opacity: 0;
    border-radius: 12px;
    transition: opacity 0.3s;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px ${props => props.$isDark 
      ? 'rgba(0, 200, 255, 0.2)' 
      : 'rgba(0, 100, 200, 0.15)'};
    border-color: ${props => props.$isDark 
      ? 'rgba(0, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.5)'};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.03);
    box-shadow: inset 0 0 20px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.3)' 
      : 'rgba(255, 100, 0, 0.25)'}, 0 0 25px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.4)' 
      : 'rgba(255, 100, 0, 0.3)'};
  }
  
  &.selected {
    border-color: ${props => props.$isDark 
      ? 'rgba(0, 220, 255, 0.8)' 
      : 'rgba(0, 100, 200, 0.8)'};
    box-shadow: 0 0 20px ${props => props.$isDark 
      ? 'rgba(0, 220, 255, 0.4)' 
      : 'rgba(0, 100, 200, 0.3)'},
                inset 0 0 15px ${props => props.$isDark 
      ? 'rgba(0, 220, 255, 0.2)' 
      : 'rgba(0, 100, 200, 0.15)'};
  }
`;

// Link Button (for footer and navigation)
export const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid ${props => props.$isDark 
    ? 'rgba(100, 116, 139, 0.4)' 
    : 'rgba(150, 160, 170, 0.4)'};
  color: ${props => props.$isDark 
    ? '#cbd5e1' 
    : '#475569'};
  
  background: ${props => props.$isDark
    ? 'rgba(30, 41, 59, 0.7)'
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &:hover {
    color: ${props => props.$isDark 
      ? '#00ffff' 
      : '#0066cc'};
    border-color: ${props => props.$isDark 
      ? 'rgba(100, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.6)'};
    transform: translateY(-2px);
    animation: ${glowPulse} 2s ease-in-out infinite;
  }

  &:active {
    box-shadow: inset 0 0 20px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.3)' 
      : 'rgba(255, 100, 0, 0.25)'}, 0 0 25px ${props => props.$isDark 
      ? 'rgba(255, 140, 0, 0.4)' 
      : 'rgba(255, 100, 0, 0.3)'};
  }
`;

export default {
  ModernButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  WarningButton,
  DangerButton,
  IconButton,
  FullWidthButton,
  FullWidthSuccessButton,
  CompactButton,
  SelectionButton,
  ColorPaletteButton,
  LinkButton,
};
