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
    filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 102, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(0, 200, 255, 0.8)) drop-shadow(0 0 24px rgba(255, 140, 0, 0.6));
  }
`;

const orangeGlowPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.6)) drop-shadow(0 0 20px rgba(255, 100, 0, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(255, 160, 20, 0.8)) drop-shadow(0 0 32px rgba(255, 120, 0, 0.6));
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
  background: ${props => props.isDark 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Default text color */
  color: ${props => props.isDark ? '#ffffff' : '#111215'};
  
  /* Subtle border */
  border: 2px solid ${props => props.isDark 
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
    border-color: ${props => props.isDark 
      ? 'rgba(100, 220, 255, 0.5)' 
      : 'rgba(0, 120, 200, 0.5)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0px);
    animation: none;
    box-shadow: inset 0 0 20px ${props => props.isDark 
      ? 'rgba(100, 200, 255, 0.3)' 
      : 'rgba(0, 100, 200, 0.3)'};
  }
  
  /* Icon spacing */
  svg {
    margin-right: 8px;
    vertical-align: middle;
  }
`;

// Primary CTA Button (vibrant cyan-to-blue gradient with orange glow)
export const PrimaryButton = styled(ModernButton)`
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, rgba(34, 197, 255, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(100, 220, 255, 0.2) 0%, rgba(100, 150, 255, 0.2) 100%)'};
  
  border: 2px solid ${props => props.isDark 
    ? 'rgba(100, 200, 255, 0.3)' 
    : 'rgba(0, 150, 200, 0.3)'};
  
  color: ${props => props.isDark 
    ? '#00d9ff' 
    : '#0066cc'};
  
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
      ${props => props.isDark ? '#0099ff' : '#0066cc'} 0%,
      ${props => props.isDark ? '#00ccff' : '#0099ff'} 100%
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
    color: ${props => props.isDark ? '#00ffff' : '#0052a3'};
    animation: ${orangeGlowPulse} 2s ease-in-out infinite;
    border-color: ${props => props.isDark 
      ? 'rgba(255, 140, 0, 0.5)' 
      : 'rgba(255, 100, 0, 0.4)'};
  }
  
  &:active:not(:disabled) {
    &::before {
      opacity: 0.2;
    }
    box-shadow: inset 0 0 30px ${props => props.isDark 
      ? 'rgba(255, 140, 0, 0.4)' 
      : 'rgba(255, 100, 0, 0.3)'}, 0 0 30px ${props => props.isDark 
      ? 'rgba(255, 120, 0, 0.5)' 
      : 'rgba(255, 100, 0, 0.4)'};
  }
`;

// Secondary Button (muted, elegant)
export const SecondaryButton = styled(ModernButton)`
  background: ${props => props.isDark
    ? 'rgba(71, 85, 105, 0.5)'
    : 'rgba(200, 210, 220, 0.4)'};
  
  border: 2px solid ${props => props.isDark 
    ? 'rgba(100, 116, 139, 0.5)' 
    : 'rgba(150, 160, 170, 0.5)'};
  
  color: ${props => props.isDark 
    ? '#cbd5e1' 
    : '#475569'};
  
  &:hover:not(:disabled) {
    background: ${props => props.isDark
      ? 'rgba(100, 120, 140, 0.6)'
      : 'rgba(150, 170, 190, 0.5)'};
    border-color: ${props => props.isDark 
      ? 'rgba(150, 180, 220, 0.6)' 
      : 'rgba(100, 150, 200, 0.6)'};
    color: ${props => props.isDark 
      ? '#e2e8f0' 
      : '#334155'};
  }
`;

// Success Button (green accent)
export const SuccessButton = styled(ModernButton)`
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(100, 220, 150, 0.2) 0%, rgba(80, 200, 140, 0.2) 100%)'};
  
  border: 2px solid ${props => props.isDark 
    ? 'rgba(74, 222, 128, 0.3)' 
    : 'rgba(50, 180, 100, 0.3)'};
  
  color: ${props => props.isDark 
    ? '#86efac' 
    : '#059669'};
  
  &:hover:not(:disabled) {
    border-color: ${props => props.isDark 
      ? 'rgba(134, 239, 172, 0.6)' 
      : 'rgba(5, 150, 105, 0.6)'};
    color: ${props => props.isDark 
      ? '#bbf7d0' 
      : '#047857'};
    animation: ${glowPulse} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 16px rgba(74, 222, 128, 0.2));
  }
`;

// Warning Button (amber/orange accent)
export const WarningButton = styled(ModernButton)`
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(255, 180, 100, 0.2) 0%, rgba(255, 150, 80, 0.2) 100%)'};
  
  border: 2px solid ${props => props.isDark 
    ? 'rgba(251, 191, 36, 0.3)' 
    : 'rgba(220, 140, 60, 0.3)'};
  
  color: ${props => props.isDark 
    ? '#fbbf24' 
    : '#d97706'};
  
  &:hover:not(:disabled) {
    border-color: ${props => props.isDark 
      ? 'rgba(251, 191, 36, 0.6)' 
      : 'rgba(217, 119, 6, 0.6)'};
    color: ${props => props.isDark 
      ? '#fcd34d' 
      : '#b45309'};
    filter: drop-shadow(0 0 8px rgba(251, 146, 60, 0.4)) drop-shadow(0 0 16px rgba(251, 146, 60, 0.2));
  }
`;

// Danger Button (red accent)
export const DangerButton = styled(ModernButton)`
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(255, 120, 120, 0.2) 0%, rgba(255, 80, 80, 0.2) 100%)'};
  
  border: 2px solid ${props => props.isDark 
    ? 'rgba(248, 113, 113, 0.3)' 
    : 'rgba(220, 38, 38, 0.3)'};
  
  color: ${props => props.isDark 
    ? '#f87171' 
    : '#dc2626'};
  
  &:hover:not(:disabled) {
    border-color: ${props => props.isDark 
      ? 'rgba(248, 113, 113, 0.6)' 
      : 'rgba(185, 28, 28, 0.6)'};
    color: ${props => props.isDark 
      ? '#fca5a5' 
      : '#991b1b'};
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
  background: ${props => props.isSelected
    ? props.isDark
      ? 'linear-gradient(135deg, rgba(34, 197, 255, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'
      : 'linear-gradient(135deg, rgba(100, 220, 255, 0.3) 0%, rgba(100, 150, 255, 0.3) 100%)'
    : props.isDark
      ? 'rgba(30, 41, 59, 0.7)'
      : 'rgba(255, 255, 255, 0.7)'};
  
  border: 2px solid ${props => props.isSelected
    ? props.isDark 
      ? 'rgba(100, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.6)'
    : props.isDark 
      ? 'rgba(100, 116, 139, 0.4)' 
      : 'rgba(150, 160, 170, 0.4)'};
  
  color: ${props => props.isSelected
    ? props.isDark 
      ? '#00ffff' 
      : '#0066cc'
    : props.isDark 
      ? '#cbd5e1' 
      : '#475569'};
  
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    border-color: ${props => props.isDark 
      ? 'rgba(100, 220, 255, 0.7)' 
      : 'rgba(0, 120, 200, 0.7)'};
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
    background: ${props => props.isDark 
      ? 'linear-gradient(135deg, rgba(0, 200, 255, 0.1), rgba(100, 150, 255, 0.1))' 
      : 'linear-gradient(135deg, rgba(0, 150, 255, 0.08), rgba(100, 200, 255, 0.08))'};
    opacity: 0;
    border-radius: 12px;
    transition: opacity 0.3s;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px ${props => props.isDark 
      ? 'rgba(0, 200, 255, 0.2)' 
      : 'rgba(0, 100, 200, 0.15)'};
    border-color: ${props => props.isDark 
      ? 'rgba(0, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.5)'};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.03);
  }
  
  &.selected {
    border-color: ${props => props.isDark 
      ? 'rgba(0, 220, 255, 0.8)' 
      : 'rgba(0, 100, 200, 0.8)'};
    box-shadow: 0 0 20px ${props => props.isDark 
      ? 'rgba(0, 220, 255, 0.4)' 
      : 'rgba(0, 100, 200, 0.3)'},
                inset 0 0 15px ${props => props.isDark 
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
  border: 2px solid ${props => props.isDark 
    ? 'rgba(100, 116, 139, 0.4)' 
    : 'rgba(150, 160, 170, 0.4)'};
  color: ${props => props.isDark 
    ? '#cbd5e1' 
    : '#475569'};
  
  background: ${props => props.isDark
    ? 'rgba(30, 41, 59, 0.7)'
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &:hover {
    color: ${props => props.isDark 
      ? '#00ffff' 
      : '#0066cc'};
    border-color: ${props => props.isDark 
      ? 'rgba(100, 220, 255, 0.6)' 
      : 'rgba(0, 120, 200, 0.6)'};
    transform: translateY(-2px);
    animation: ${glowPulse} 2s ease-in-out infinite;
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
