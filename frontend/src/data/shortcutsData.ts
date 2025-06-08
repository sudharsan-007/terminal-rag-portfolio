// Define types for shortcuts and page shortcuts
export interface Shortcut {
  keys: string;
  description: string;
}

export interface PageShortcuts {
  pageTitle: string;
  shortcuts: Shortcut[];
}

// Define global shortcuts that appear on all pages
export const globalShortcuts: Shortcut[] = [
  { keys: 'ALT+[key]', description: 'Access menu items' }
];

// Define page-specific shortcuts
export const pageShortcuts: Record<string, PageShortcuts> = {
  '/': {
    pageTitle: 'Home',
    shortcuts: [
      { keys: '← / →', description: 'Navigate responses' },
      { keys: 'Ctrl+R', description: 'Reset terminal' },
      { keys: 'Enter', description: 'Submit question' },
      { keys: 'Tab', description: 'Focus navigation' }
    ]
  },
  '/blog': {
    pageTitle: 'Blog',
    shortcuts: [
      { keys: '↑/↓/←/→', description: 'Navigate posts' },
      { keys: 'Enter', description: 'Open post' },
      { keys: '/', description: 'Focus search' },
      { keys: 'V', description: 'Toggle view mode' },
      { keys: 'ESC', description: 'Blur search field' }
    ]
  },
  '/projects': {
    pageTitle: 'Projects',
    shortcuts: [
      { keys: '↑/↓', description: 'Navigate projects' },
      { keys: 'Enter', description: 'View project details' },
      { keys: 'G', description: 'Open GitHub repository' },
      { keys: 'ESC', description: 'Return from details view' }
    ]
  },
  '/skills': {
    pageTitle: 'Skills',
    shortcuts: [
      { keys: 'Drag', description: 'Move skill nodes' },
      { keys: 'Click', description: 'Select skill node' },
      { keys: 'Scroll', description: 'Zoom in/out' },
      { keys: 'Double-click', description: 'Reset view' }
    ]
  },
  '/resume': {
    pageTitle: 'Resume',
    shortcuts: [
      { keys: 'W/A/S/D', description: 'Move character' },
      { keys: 'E', description: 'Interact with items' },
      { keys: 'ESC', description: 'Exit game view' },
      { keys: 'Space', description: 'Pause game' }
    ]
  },
  '/contact': {
    pageTitle: 'Contact',
    shortcuts: [
      { keys: 'Tab', description: 'Navigate form fields' },
      { keys: 'Enter', description: 'Submit form' },
      { keys: 'ESC', description: 'Reset form' }
    ]
  }
};

// Helper function to get shortcuts for a specific path
export const getShortcutsForPath = (pathname: string): PageShortcuts => {
  // Handle blog posts
  if (pathname.startsWith('/blog/')) {
    return {
      pageTitle: 'Blog Post',
      shortcuts: [
        { keys: 'ESC', description: 'Return to blog list' },
        { keys: '↑/↓', description: 'Navigate related posts' }
      ]
    };
  }

  // Get exact page or first matching path
  const exactMatch = pageShortcuts[pathname];
  if (exactMatch) return exactMatch;

  // Find the base path if it's a nested route
  const basePath = '/' + pathname.split('/')[1];
  return pageShortcuts[basePath] || pageShortcuts['/'];
}; 