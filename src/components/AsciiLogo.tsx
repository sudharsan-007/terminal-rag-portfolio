
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Full ASCII art for desktop
const desktopAscii = `
 ███████╗██╗   ██╗██████╗ ██╗  ██╗ █████╗ ██████╗ ███████╗ █████╗ ███╗   ██╗
 ██╔════╝██║   ██║██╔══██╗██║  ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║
 ███████╗██║   ██║██║  ██║███████║███████║██████╔╝███████╗███████║██╔██╗ ██║
 ╚════██║██║   ██║██║  ██║██╔══██║██╔══██║██╔══██╗╚════██║██╔══██║██║╚██╗██║
 ███████║╚██████╔╝██████╔╝██║  ██║██║  ██║██║  ██║███████║██║  ██║██║ ╚████║
 ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
`;

// Simplified ASCII art for mobile
const mobileAscii = `
 ███████╗██╗   ██╗██████╗ ██╗  ██╗ █████╗ ██████╗ ███████╗ █████╗ ███╗   ██╗
`;

const AsciiLogo: React.FC = () => {
  const isMobile = useIsMobile();
  const [displayAscii, setDisplayAscii] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setDisplayAscii(isMobile ? mobileAscii : desktopAscii);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <div 
      className={`w-full flex justify-center my-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <pre className="ascii-art text-terminal-text text-xs sm:text-sm md:text-base whitespace-pre overflow-x-auto max-w-full">
        {displayAscii}
      </pre>
    </div>
  );
};

export default AsciiLogo;
