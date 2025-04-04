
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// In a real implementation, you would import an actual QR code image
// For this demo, we'll create a simple representation
const QrCodeDisplay = () => {
  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/in/yourusername', '_blank');
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="border-2 border-terminal-text p-4 mb-6 bg-terminal-navy/30 rounded-md relative overflow-hidden">
        {/* QR Code ASCII Representation */}
        <div className="text-terminal-text font-mono text-xs leading-none whitespace-pre">
          {`
          ██████████████  ██████████████
          ██          ██  ██          ██
          ██  ██████  ██  ██  ██████  ██
          ██  ██████  ██  ██  ██████  ██
          ██  ██████  ██  ██  ██████  ██
          ██          ██  ██          ██
          ██████████████  ██████████████
                          ██████████████
          ████████  ██    ██████      ██
          ██  ████  ██████    ██  ██  ██
                ██  ██    ████████    ██
          ██████████████  ██████████  ██
          ██          ████    ██████████
          ██  ██████  ██  ██████  ██    
          ██  ██████  ██████████    ████
          ██  ██████  ██    ██  ████  ██
          ██          ██  ██████      ██
          ██████████████  ██████████████
          `}
        </div>
        
        {/* Overlay glow effect */}
        <div className="absolute inset-0 bg-terminal-text/5 glow-effect"></div>
      </div>
      
      <Button 
        onClick={handleLinkedInClick}
        variant="outline" 
        className="border border-terminal-text text-terminal-text hover:bg-terminal-text/10"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Visit LinkedIn Profile
      </Button>
      
      <p className="text-sm text-terminal-text/70 mt-4 text-center">
        Scan the QR code with your mobile device<br />or click the button above
      </p>
    </div>
  );
};

export default QrCodeDisplay;
