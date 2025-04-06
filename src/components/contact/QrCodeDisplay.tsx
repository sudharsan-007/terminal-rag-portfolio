import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QrCodeDisplay = () => {
  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/in/yourusername', '_blank');
  };
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[#9031aa] text-lg mb-4">Visit LinkedIn Profile</h3>
      
      <div className="bg-terminal-navy/30 border border-terminal-text/30 rounded-md p-4 flex flex-col items-center h-full">
        <div className="mb-4 relative flex-grow flex items-center justify-center">
          <div className="relative overflow-hidden rounded-md" style={{ width: '200px', height: '200px' }}>
            <img 
              src="/assets/qr/linkedin-qr.png" 
              alt="LinkedIn QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="mt-auto flex flex-col items-center w-full">
          <Button 
            onClick={handleLinkedInClick}
            variant="outline" 
            className="border border-[#9031aa] text-[#9031aa] hover:bg-[#9031aa]/10 w-full max-w-[220px]"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit LinkedIn Profile
          </Button>
          
          <p className="text-sm text-terminal-text/70 mt-4 text-center">
            Scan the QR code with your mobile device<br />
            or click the button above
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrCodeDisplay;
