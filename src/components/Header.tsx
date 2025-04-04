
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  label: string;
  shortcut: string;
  href: string;
}

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
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
    <header className="py-4 px-4 md:px-8">
      {isMobile ? (
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="text-terminal-text text-lg">
              sudharsan@portfolio:~
            </div>
            <button 
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-terminal-text focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {menuOpen && (
            <nav className="absolute top-full left-0 right-0 bg-terminal-navy border border-terminal-text rounded-md mt-2 z-50 animate-fade-in">
              <ul className="py-2">
                {navItems.map((item) => (
                  <li key={item.label} className="block">
                    <Link
                      to={item.href}
                      className={`block py-3 px-4 hover:bg-terminal-text/10 ${
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
        <nav className="flex justify-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 rounded border ${
                isActive(item.href) 
                  ? 'bg-terminal-accent1 text-white border-terminal-accent1' 
                  : 'border-terminal-text text-terminal-text hover:bg-terminal-text/10'
              }`}
            >
              [{item.shortcut}] {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
