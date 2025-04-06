import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { getShortcutsForPath, globalShortcuts } from '@/data/shortcutsData';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pageShortcuts = getShortcutsForPath(location.pathname);
  
  // Special handling for blog page which has more shortcuts
  const isBlogPage = location.pathname === '/blog';
  
  // Distribute shortcuts evenly across columns
  const shortcuts = pageShortcuts.shortcuts;
  const shortcutColumns = isBlogPage 
    ? [
        shortcuts.slice(0, 2), // First column gets 2 items
        shortcuts.slice(2, 4), // Second column gets 2 items 
        shortcuts.slice(4)     // Third column gets the rest
      ]
    : [
        shortcuts.slice(0, Math.ceil(shortcuts.length / 2)),
        shortcuts.slice(Math.ceil(shortcuts.length / 2))
      ];
  
  return (
    <footer className={cn("mt-auto", className)}>
      {!isMobile && (
        <div className="border-t border-terminal-text/30 pt-3 h-[100px] text-terminal-text/70 text-sm">
          <div className="grid grid-cols-4 gap-x-4 px-4">
            {/* Global shortcuts - first column */}
            <div>
              <div className="mb-1.5 text-sm text-terminal-text">
                <strong>Keyboard shortcuts</strong>
              </div>
              {globalShortcuts.map((shortcut, index) => (
                <div key={index} className="mb-0.5">
                  <span className="text-terminal-accent1 font-medium">{shortcut.keys}</span>: {shortcut.description}
                </div>
              ))}
            </div>
            
            {/* Page shortcuts distributed across columns */}
            <div>
              <div className="mb-1.5 text-sm text-terminal-text">
                <strong>{pageShortcuts.pageTitle}</strong>
              </div>
              {shortcutColumns[0].map((shortcut, index) => (
                <div key={index} className="mb-0.5">
                  <span className="text-terminal-accent1 font-medium">{shortcut.keys}</span>: {shortcut.description}
                </div>
              ))}
            </div>
            
            <div className="pt-5">
              {shortcutColumns[1]?.map((shortcut, index) => (
                <div key={index} className="mb-0.5">
                  <span className="text-terminal-accent1 font-medium">{shortcut.keys}</span>: {shortcut.description}
                </div>
              ))}
            </div>
            
            {isBlogPage && (
              <div className="pt-5">
                {shortcutColumns[2]?.map((shortcut, index) => (
                  <div key={index} className="mb-0.5">
                    <span className="text-terminal-accent1 font-medium">{shortcut.keys}</span>: {shortcut.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="py-1 px-4 text-center text-terminal-text/50 text-sm border-t border-terminal-text/10">
        © {new Date().getFullYear()} Sudharsan Ananth. All rights reserved.
      </div>
    </footer>
  );
};

export default memo(Footer);
