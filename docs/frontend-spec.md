# Frontend Technical Specification
# Terminal Portfolio with Interactive Resume Game

## Document Information
- **Document Owner:** Sudharsan Ananth
- **Date Created:** March 26, 2025
- **Last Updated:** June 8, 2025
- **Status:** Current Implementation

## Overview
This document outlines the technical architecture, components, and implementation details for the frontend of the Terminal Portfolio project. The frontend is built using React 18 with TypeScript, featuring an interactive resume game powered by PixiJS and Matter.js physics engine, along with a terminal interface for RAG-powered interactions.

## Technology Stack
- **Framework**: React v18.3+ with TypeScript v5.5+
- **Build Tool**: Vite v5.4+ with SWC compiler
- **Package Manager**: npm
- **Styling**: Tailwind CSS v3.4+ with custom design system
- **UI Components**: shadcn/ui, Radix UI primitives
- **Game Engine**: PixiJS v7.4+ for 2D rendering, Matter.js v0.19+ for physics
- **Animations**: Framer Motion v12.6+
- **Routing**: React Router DOM v6.26+
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Form Handling**: React Hook Form v7.53+ with Zod validation
- **Data Visualization**: React Force Graph 2D v1.27+
- **Content Processing**: React Markdown v9.0+ with syntax highlighting
- **API Communication**: Fetch API with custom service layer

## Architecture

### Core Architecture Principles
- **Component-Based Design**: Modular, reusable components with clear separation of concerns
- **Performance-First**: Optimized rendering with lazy loading and code splitting
- **Accessibility-First**: WCAG 2.1 AA compliance with keyboard navigation
- **Mobile-First**: Responsive design with touch-optimized interactions
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with React

### Project Structure
```
src/
├── components/           # React components
│   ├── blog/            # Blog-related components
│   ├── contact/         # Contact page components
│   ├── projects/        # Project showcase components
│   ├── resume/          # Resume and game components
│   │   ├── ResumeGame.tsx      # Main game component
│   │   ├── GameDialog.tsx      # Item collection dialog
│   │   ├── GameObjects.tsx     # Game objects renderer
│   │   ├── GameStateUI.tsx     # Game state overlay
│   │   ├── Player.tsx          # Player character
│   │   ├── useGameLogic.ts     # Game logic hook
│   │   └── ResumeContent.tsx   # Traditional resume view
│   ├── skills/          # Skills visualization
│   └── ui/              # shadcn/ui components
├── data/                # Static data and content
│   └── resumeData.ts    # Structured resume data
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── pages/               # Page components
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Resume.tsx
│   └── Skills.tsx
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  assetsInclude: ['**/*.md', '**/*.png', '**/*.jpg', '**/*.webp'],
  server: { host: "::", port: 8080 }
});
```

## Game Engine Architecture

### PixiJS Integration
The interactive resume game uses PixiJS for high-performance 2D rendering:

```typescript
// Game initialization
const app = new PIXI.Application({
  width: 800,
  height: 300,
  backgroundColor: 0x0A1929,
  antialias: true,
});
```

### Matter.js Physics Engine
Physics simulation for realistic character movement and collision detection:

```typescript
// Physics engine setup
const engine = Matter.Engine.create({
  gravity: { x: 0, y: 1 }
});

// Player body creation
const playerBody = Matter.Bodies.circle(
  x, y, radius,
  { restitution: 0, friction: 0.1, label: 'player' }
);
```

### Game Components Architecture

#### ResumeGame.tsx
Main game component that orchestrates all game elements:
- Manages PixiJS application lifecycle
- Handles error boundaries for graceful degradation
- Coordinates between game logic and UI components
- Implements responsive design for mobile/desktop

#### useGameLogic.ts
Custom hook containing all game logic:
- Physics engine management
- Collision detection and response
- Game state management (start, playing, paused, gameOver)
- Player controls and movement
- Item collection and dialog management

#### Game Object System
- **Player**: Character with jump, duck, and movement abilities
- **Platforms**: Static collision bodies for level geometry
- **Collectibles**: Interactive items representing resume elements
- **Dialog System**: Modal displays for collected item details

## Component Specifications

### Terminal Interface Components
The terminal system provides an interactive command-line experience:

```typescript
interface TerminalState {
  history: TerminalEntry[];
  currentInput: string;
  isProcessing: boolean;
  currentIndex: number;
}

interface TerminalEntry {
  type: 'command' | 'response' | 'error';
  content: string;
  timestamp: Date;
  metadata?: any;
}
```

### Skills Visualization
Interactive force-directed graph using React Force Graph:

```typescript
interface SkillNode {
  id: string;
  name: string;
  group: string;
  level: number;
  description: string;
  val: number; // Node size
}

interface SkillLink {
  source: string;
  target: string;
  value: number; // Link strength
}
```

### Blog System
Markdown-based blog with syntax highlighting:
- React Markdown for content rendering
- Rehype plugins for syntax highlighting
- Image optimization with lazy loading
- Tag-based filtering and search

### Project Showcase
Dynamic project display with filtering:
- Card-based layout with hover effects
- Technology tag system
- Modal dialogs for detailed information
- GitHub integration and live demo links

## State Management Strategy

### Local Component State
```typescript
// Example: Game state management
const [gameState, setGameState] = useState<GameState>('start');
const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
```

### Custom Hooks
Reusable state logic extracted into custom hooks:
- `useGameLogic`: Game state and physics management
- `usePreventRapidNavigation`: Navigation throttling
- `useToast`: Notification system

### Context Providers
Shared state for cross-component communication:
- Theme context for dark/light mode
- Terminal context for command history
- Game progress context for achievement tracking

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading for route components
const Resume = lazy(() => import('@/pages/Resume'));
const Projects = lazy(() => import('@/pages/Projects'));
```

### Asset Optimization
- WebP image format with fallbacks
- Lazy loading for images and heavy components
- Bundle size optimization with tree shaking
- Service worker for caching (planned)

### Game Performance
- RequestAnimationFrame for smooth animations
- Object pooling for game entities
- Efficient collision detection algorithms
- Adaptive quality settings for low-end devices

## Responsive Design Implementation

### Breakpoint System
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Optimizations
- Touch-friendly game controls
- Responsive typography scaling
- Optimized layout for portrait/landscape
- Reduced animation complexity on mobile

### Game Responsiveness
- Adaptive canvas sizing
- Touch controls for mobile gameplay
- Simplified UI elements on small screens
- Performance monitoring and adjustment

## Accessibility Implementation

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Focus management and visual indicators
- Keyboard shortcuts for common actions
- Tab order optimization

### Screen Reader Support
- ARIA labels and descriptions
- Semantic HTML structure
- Live regions for dynamic content updates
- Alternative text for all visual elements

### Game Accessibility
- Alternative text descriptions for game elements
- Keyboard controls as primary input method
- High contrast mode support
- Option to skip game and view traditional resume

## API Integration Architecture

### Service Layer
```typescript
// API service structure
export const apiService = {
  async askQuestion(question: string): Promise<RAGResponse> {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  }
};
```

### Error Handling
- Consistent error boundaries throughout the application
- Graceful degradation for API failures
- User-friendly error messages
- Retry mechanisms for transient failures

### Loading States
- Skeleton screens for content loading
- Progress indicators for long operations
- Optimistic updates where appropriate
- Smooth transitions between states

## Testing Strategy

### Component Testing
```typescript
// Example test structure
describe('ResumeGame', () => {
  it('should initialize game correctly', () => {
    render(<ResumeGame onItemCollect={mockFn} setShowGame={mockFn} />);
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });
});
```

### Game Testing
- Physics simulation testing
- Collision detection verification
- Performance benchmarking
- Cross-browser compatibility testing

### Accessibility Testing
- Automated accessibility testing with axe-core
- Manual keyboard navigation testing
- Screen reader compatibility verification
- Color contrast validation

## Build and Deployment

### Development Workflow
```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format

# Production build
npm run build

# Preview production build
npm run preview
```

### Production Optimizations
- Asset compression and minification
- Tree shaking for unused code elimination
- Critical CSS inlining
- Progressive web app features (planned)

### Environment Configuration
```typescript
// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_ENVIRONMENT: 'development' | 'production';
}
```

## Security Considerations

### Input Sanitization
- XSS prevention for user inputs
- Content Security Policy implementation
- Safe HTML rendering for markdown content
- API request validation

### Data Protection
- No sensitive data in client-side code
- Secure API communication over HTTPS
- Rate limiting for API requests
- User privacy protection

## Future Enhancements

### Planned Features
- Voice interaction using Web Speech API
- Real-time collaboration features
- Advanced analytics and user behavior tracking
- Progressive Web App capabilities

### Technical Improvements
- Service worker implementation for offline functionality
- Advanced caching strategies
- Performance monitoring and optimization
- A/B testing framework

### Game Enhancements
- Multiple game levels
- Achievement system
- Leaderboards and social features
- VR/AR integration (experimental)

## Dependencies Overview

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.1",
  "tailwindcss": "^3.4.11"
}
```

### Game Engine
```json
{
  "pixi.js": "^7.4.3",
  "matter-js": "^0.19.0",
  "@pixi/assets": "^7.4.3"
}
```

### UI and Animation
```json
{
  "framer-motion": "^12.6.3",
  "@radix-ui/react-*": "^1.x.x",
  "lucide-react": "^0.462.0"
}
```

### Development Tools
```json
{
  "@vitejs/plugin-react-swc": "^3.5.0",
  "eslint": "^9.9.0",
  "prettier": "^3.5.3",
  "@types/react": "^18.3.3"
}
```

## Conclusion

The frontend architecture successfully balances performance, accessibility, and user experience while showcasing advanced technical capabilities through the interactive resume game. The modular component structure and comprehensive testing strategy ensure maintainability and scalability for future enhancements.

The integration of PixiJS and Matter.js demonstrates proficiency in game development and physics simulation, while the React-based architecture showcases modern frontend development practices. The responsive design and accessibility features ensure the portfolio is inclusive and professional across all devices and user capabilities.