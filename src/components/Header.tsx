import React, { useState, memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  label: string;
  shortcut: string;
  href: string;
}

const getPathPrompt = (pathname: string, isMobile: boolean): string => {
  // Use different usernames based on device
  const basePrompt = isMobile ? 'sudu@portfolio:~' : 'sudharsan@portfolio:~';
  
  if (pathname === '/') return basePrompt;
  
  const path = pathname.split('/').filter(Boolean);
  const fullPath = path.join('/');
  
  // For blog posts with slugs, truncate the slug if it's too long
  if (path[0] === 'blog' && path.length > 1 && path[1].length > 15) {
    return `${basePrompt}/${path[0]}/${path[1].substring(0, 12)}...`;
  }
  
  return `${basePrompt}/${fullPath}`;
};

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const pathPrompt = getPathPrompt(location.pathname, isMobile);
  
  const navItems: NavItem[] = [
    { label: 'Home', shortcut: 'ALT+H', href: '/' },
    { label: 'Projects', shortcut: 'ALT+P', href: '/projects' },
    { label: 'Blog', shortcut: 'ALT+B', href: '/blog' },
    { label: 'Skills', shortcut: 'ALT+S', href: '/skills' },
    { label: 'Resume', shortcut: 'ALT+R', href: '/resume' },
    { label: 'Contact', shortcut: 'ALT+C', href: '/contact' },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <header className="py-3 px-3 md:px-6 h-14 flex items-center">
      {isMobile ? (
        <div className="relative w-full">
          <div className="flex items-center justify-between">
            <div className="text-terminal-text text-sm sm:text-base truncate max-w-[75%]">
              {pathPrompt}
            </div>
            <button 
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-terminal-text focus:outline-none ml-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {menuOpen && (
            <nav className="absolute top-full left-0 right-0 bg-terminal-navy border border-terminal-text rounded-md mt-2 z-50 animate-fade-in">
              <ul className="py-1">
                {navItems.map((item) => (
                  <li key={item.label} className="block">
                    <Link
                      to={item.href}
                      className={`block py-2 px-3 text-sm hover:bg-terminal-text/10 ${
                        isActive(item.href) ? 'text-terminal-accent1' : 'text-terminal-text'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div className="text-terminal-text text-base sm:text-lg md:text-xl truncate max-w-[35%]">
            {pathPrompt}
          </div>
          <nav className="flex justify-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-3 py-1.5 text-sm rounded border ${
                  isActive(item.href) 
                    ? 'bg-terminal-accent1 text-white border-terminal-accent1' 
                    : 'border-terminal-text text-terminal-text hover:bg-terminal-text/10'
                }`}
              >
                [{item.shortcut.replace('ALT+', '')}] {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default memo(Header);
