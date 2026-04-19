// Google Fonts loader utility
export const googleFonts = [
  'Inter',
  'Orbitron',
  'Playfair Display',
  'Merriweather',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Ubuntu',
  'IBM Plex Sans',
  'Bitter',
  'Crimson Text',
  'Dosis',
];

// Function to properly format font name for CSS
export const formatFontForCSS = (fontName) => {
  // Return the font name properly quoted for use in font-family
  return `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
};

// Preload all Google Fonts on app init
export const preloadGoogleFonts = () => {
  const fontString = googleFonts
    .map(font => font.replace(/\s+/g, '+'))
    .join('|');
  
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontString}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
