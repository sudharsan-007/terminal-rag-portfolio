
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="mt-auto py-4 px-4">
      {!isMobile && (
        <div className="border-t border-terminal-text/30 pt-4 text-terminal-text/70 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <strong>Keyboard shortcuts:</strong>
            </div>
            <div>
              <span className="block">← / →: Navigate history</span>
              <span className="block">Ctrl+R: Reset terminal</span>
            </div>
            <div>
              <span className="block">Enter: Submit question</span>
              <span className="block">Tab: Focus navigation</span>
              <span className="block">ALT+[key]: Access menu items</span>
            </div>
          </div>
        </div>
      )}
      <div className="text-center text-terminal-text/50 text-sm mt-4">
        © {new Date().getFullYear()} Sudharsan Ananth. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
