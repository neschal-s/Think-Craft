import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { LinkButton } from '../styles/ModernButtons';

const Footer = () => {
  const { isDark, theme } = useTheme();

  // Update these links with your actual details
  const links = [
    {
      label: 'GitHub',
      url: 'https://github.com/neschal-s',
      icon: '⚙'
    },
    {
      label: 'Email',
      url: 'mailto:singhneschal@gmail.com',
      icon: '✉'
    },
    {
      label: 'Twitter',
      url: 'https://x.com/neschal_s',
      icon: '𝕏'
    }
  ];

  return (
    <footer className={`border-t ${theme.colors.border} transition-colors duration-300 mt-4 py-4 ${isDark ? 'bg-[#0f1115]/50 backdrop-blur-md' : 'bg-white/60 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="text-center">
          <h3 className={`font-['Orbitron'] text-2xl font-bold mb-4 ${theme.colors.text.primary} tracking-wide`}>
            Connect with Developer
          </h3>
          
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            {links.map((link, idx) => (
              <LinkButton
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                $isDark={isDark}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </LinkButton>
            ))}
          </div>

          <div className={`space-y-1 max-w-lg mx-auto font-['Inter']`}>
            <p className={`${theme.colors.text.secondary} font-small font-normal`}>
              Built with passion
            </p>
            <p className={`${theme.colors.text.tertiary} text-xs mt-4 font-normal`}>
              © 2026 ThinkCraft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
