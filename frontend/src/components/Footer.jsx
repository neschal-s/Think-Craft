import React from 'react';
import { useTheme } from '../context/ThemeContext';

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
    <footer className={`border-t ${theme.colors.border} transition-colors duration-300 mt-4 py-4 ${isDark ? 'bg-slate-950/50 backdrop-blur-md' : 'bg-white/60 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="text-center">
          <h3 className={`text-2xl font-bold mb-4 ${theme.colors.text.primary} font-['Poppins']`}>
            Connect with Developer
          </h3>
          
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-light font-['Poppins'] hover:scale-105 ${
                  isDark
                    ? 'border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10'
                    : 'border-gray-400 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          <div className={`space-y-1 max-w-lg mx-auto font-['Poppins']`}>
            <p className={`${theme.colors.text.secondary} font-small`}>
              Built with passion
            </p>
            <p className={`${theme.colors.text.tertiary} text-xs mt-4`}>
              © 2026 ThinkCraft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
