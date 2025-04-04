
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QrCodeDisplay = () => {
  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/in/yourusername', '_blank');
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-6 relative">
        <div className="relative overflow-hidden rounded-md" style={{ width: '220px', height: '220px' }}>
          <img 
            src="/lovable-uploads/97b98287-d221-43f3-af04-ec77e0dbd11e.png" 
            alt="LinkedIn Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
          />
          
          {/* Overlay glow effect */}
          <div className="absolute inset-0 bg-terminal-text/5 glow-effect"></div>
        </div>
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
