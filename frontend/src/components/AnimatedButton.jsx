import React from 'react';
import styled from 'styled-components';

const AnimatedButton = ({ children, onClick, disabled, className = '', type = 'button', style, useGlow = true, size = 'medium' }) => {
  const sizeConfig = {
    small: { width: '80px', height: '40px', padding: '0.5rem 1rem' },
    medium: { width: '120px', height: '60px', padding: '0.75rem 1.5rem' },
    large: { width: '160px', height: '80px', padding: '1rem 2rem' },
    auto: { width: 'auto', height: 'auto', padding: '0.75rem 1.5rem' }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <StyledWrapper $useGlow={useGlow} $size={size}>
      <svg style={{position: 'absolute', width: 0, height: 0}}>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 
          0 1 0 0 0 
          0 0 1 0 0 
          0 0 0 9 0" />
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq2">
          <feColorMatrix values="1 0 0 0 0 
          0 1 0 0 0 
          0 0 1 0 0 
          0 0 0 3 0" />
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq3">
          <feColorMatrix values="1 0 0 0.2 0 
          0 1 0 0.2 0 
          0 0 1 0.2 0 
          0 0 0 2 0" />
        </filter>
      </svg>
      <button 
        className={`real-button ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
        style={{ ...config, ...style }}
      />
      <div className="backdrop" />
      <div className="button-container" style={{ ...config }}>
        <div className="spin spin-blur" />
        <div className="spin spin-intense" />
        <div className="backdrop" />
        <div className="button-border">
          <div className="spin spin-inside" />
          <div className="button">
            {children}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;

  .button-container {
    position: relative;
  }

  .button-border {
    padding: 3px;
    inset: 0;
    background: #0005;
    border-radius: inherit;
  }

  .button {
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 0.875em;
    width: 100%;
    height: 100%;
    background: #111215;
    display: flex;
    flex-direction: column;
    color: #fff;
    overflow: hidden;
    font-weight: 600;
    font-size: ${props => {
      switch(props.$size) {
        case 'small': return '0.75rem';
        case 'large': return '1.125rem';
        case 'auto': return '1rem';
        default: return '1rem';
      }
    }};
  }

  .real-button {
    position: absolute;
    z-index: 1;
    outline: none;
    border: none;
    border-radius: 17px;
    cursor: pointer;
    opacity: 0;
    &:disabled {
      cursor: not-allowed;
      opacity: 0;
    }
  }

  .backdrop {
    position: absolute;
    inset: -9900%;
    background: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 20%,
      #111111aa 50%
    );
    background-size: 3px 3px;
    z-index: -1;
  }

  .spin {
    position: absolute;
    inset: 0;
    z-index: -2;
    opacity: 0.5;
    overflow: hidden;
    transition: 0.3s;
  }

  .real-button:active ~ div .spin {
    opacity: 1;
  }

  .spin-blur {
    filter: blur(2em) url(#unopaq);
  }

  .spin-intense {
    inset: -0.125em;
    filter: blur(0.25em) url(#unopaq2);
    border-radius: 0.75em;
  }

  .spin-inside {
    inset: -2px;
    border-radius: inherit;
    filter: blur(2px) url(#unopaq3);
    z-index: 0;
  }

  .spin::before {
    content: "";
    position: absolute;
    inset: -150%;
    animation:
      speen 8s cubic-bezier(0.56, 0.15, 0.28, 0.86) infinite,
      woah 4s infinite;
    animation-play-state: paused;
  }

  .real-button:hover ~ div .spin::before {
    animation-play-state: running;
  }

  .spin-blur::before {
    background: linear-gradient(90deg, #f50 30%, #0000 50%, #05f 70%);
  }

  .spin-intense::before {
    background: linear-gradient(90deg, #f95 20%, #0000 45% 55%, #59f 80%);
  }

  .spin-inside::before {
    background: linear-gradient(90deg, #fc9 30%, #0000 45% 55%, #9cf 70%);
  }

  @keyframes speen {
    0% {
      rotate: 10deg;
    }
    50% {
      rotate: 190deg;
    }
    to {
      rotate: 370deg;
    }
  }

  @keyframes woah {
    0%, to {
      scale: 1;
    }
    50% {
      scale: 0.75;
    }
  }
`;

export default AnimatedButton;
