import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Simplified ASCII art for "SUDU"
const desktopAscii = `
 ███████╗██╗   ██╗██████╗ ██╗   ██╗
 ██╔════╝██║   ██║██╔══██╗██║   ██║
 ███████╗██║   ██║██║  ██║██║   ██║
 ╚════██║██║   ██║██║  ██║██║   ██║
 ███████║╚██████╔╝██████╔╝╚██████╔╝
 ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ 
`;

// Improved compact ASCII art for mobile
const mobileAscii = `
 ███████╗██╗   ██╗██████╗ ██╗   ██╗
 ██╔════╝██║   ██║██╔══██╗██║   ██║
 ███████╗██║   ██║██║  ██║██║   ██║
 ╚════██║██║   ██║██║  ██║██║   ██║
 ███████║╚██████╔╝██████╔╝╚██████╔╝
`;

interface AsciiLogoProps {
  className?: string;
}

const AsciiLogo: React.FC<AsciiLogoProps> = ({ className }) => {
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
      className={cn(`w-full flex justify-center my-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`, className)}
    >
      <pre className="ascii-art text-terminal-text text-xs sm:text-sm md:text-base whitespace-pre overflow-x-auto max-w-full px-2 text-center font-mono">
        {displayAscii}
      </pre>
    </div>
  );
};

export default AsciiLogo;
