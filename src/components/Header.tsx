
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AsciiLogo from './AsciiLogo';

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="py-6 px-4 md:px-8 border-b border-terminal-text/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <AsciiLogo />
            </Link>
          </div>

          <nav className="flex gap-4">
            <Link 
              to="/" 
              className={`nav-button ${currentPath === '/' ? 'active-nav' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={`nav-button ${currentPath === '/projects' ? 'active-nav' : ''}`}
            >
              Projects
            </Link>
            <Link 
              to="/skills" 
              className={`nav-button ${currentPath === '/skills' ? 'active-nav' : ''}`}
            >
              Skills
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
