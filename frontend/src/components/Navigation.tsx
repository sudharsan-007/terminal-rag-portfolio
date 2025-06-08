import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Code2, Binary, FileText, Mail, FileSpreadsheet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePreventRapidNavigation } from '@/hooks/usePreventRapidNavigation';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Navigation = ({ isOpen, onToggle }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isNavigating, safeNavigate } = usePreventRapidNavigation();
  
  const isActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };
  
  const handleNavigation = (path: string) => {
    if (isNavigating) return; // Skip if already navigating
    
    // Use safe navigation instead of direct navigation
    safeNavigate(path);
    
    if (isMobile && isOpen) {
      onToggle();
    }
  };
  
  return (
    <div className="nav-links flex flex-col space-y-2">
      <a
        className={`nav-link ${isActive('/') ? 'active' : ''}`}
        onClick={() => handleNavigation('/')}
      >
        <Terminal size={isMobile ? 18 : 20} />
        <span className="nav-text">Home</span>
      </a>
      <a
        className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
        onClick={() => handleNavigation('/projects')}
      >
        <Code2 size={isMobile ? 18 : 20} />
        <span className="nav-text">Projects</span>
      </a>
      <a
        className={`nav-link ${isActive('/skills') ? 'active' : ''}`}
        onClick={() => handleNavigation('/skills')}
      >
        <Binary size={isMobile ? 18 : 20} />
        <span className="nav-text">Skills</span>
      </a>
      <a
        className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
        onClick={() => handleNavigation('/blog')}
      >
        <FileText size={isMobile ? 18 : 20} />
        <span className="nav-text">Blog</span>
      </a>
      <a
        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
        onClick={() => handleNavigation('/contact')}
      >
        <Mail size={isMobile ? 18 : 20} />
        <span className="nav-text">Contact</span>
      </a>
      <a
        className={`nav-link ${isActive('/resume') ? 'active' : ''}`}
        onClick={() => handleNavigation('/resume')}
      >
        <FileSpreadsheet size={isMobile ? 18 : 20} />
        <span className="nav-text">Resume</span>
      </a>
    </div>
  );
};

export default Navigation; 