import React, { useEffect, useState } from 'react';

// BPMN Font Loader Component
export const BPMNFontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadBPMNFont = async () => {
      try {
        console.log('Loading BPMN font...');
        const fontResponse = await fetch('/bpmn.svg');
        
        if (!fontResponse.ok) {
          throw new Error(`Failed to fetch BPMN font: ${fontResponse.status} ${fontResponse.statusText}`);
        }
        
        const fontText = await fontResponse.text();
        console.log('BPMN font loaded successfully');
        
        // Create a style element to inject the font
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'bpmn';
            src: url('data:font/svg+xml;base64,${btoa(fontText)}') format('svg');
          }
          
          .bpmn-icon {
            font-family: 'bpmn';
            font-size: 1em;
            line-height: 1;
            vertical-align: middle;
          }
        `;
        
        document.head.appendChild(style);
        setFontLoaded(true);
        console.log('BPMN font injected into DOM');
      } catch (error) {
        console.error('Failed to load BPMN font:', error);
        setFontLoaded(true); // Continue anyway
      }
    };

    loadBPMNFont();
  }, []);

  return <>{children}</>;
}; 