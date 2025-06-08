# Frontend Technical Specification
# Terminal Portfolio

## Overview
This document outlines the technical architecture, components, and implementation details for the frontend of the Terminal Portfolio project. The frontend will be built using Astro with React components, focusing on performance, accessibility, and responsive design.

## Technology Stack
- **Framework**: Astro v3.0+
- **UI Components**: React v18.0+
- **Typing**: TypeScript v5.0+
- **Styling**: Tailwind CSS v3.3+
- **Data Visualization**: D3.js v7.0+
- **State Management**: React Hooks (useState, useEffect, useContext)
- **API Communication**: Fetch API
- **Build/Bundle**: Vite (via Astro)

## Architecture

### Core Architecture Principles
- **Island Architecture**: Utilizing Astro's partial hydration model for optimal performance
- **Component-Based Design**: Modular components for maintainability and reusability
- **Static-First Philosophy**: Maximize static generation for performance
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with hydration

### Folder Structure
```
frontend/
├── public/                # Static assets
│   ├── fonts/            # Custom fonts
│   └── images/           # Static images
├── src/
│   ├── assets/           # Processed assets (optimized at build)
│   ├── components/       # React components
│   │   ├── core/         # Core UI components
│   │   ├── layout/       # Layout components
│   │   ├── terminal/     # Terminal-specific components
│   │   └── visualizations/ # Data visualization components
│   ├── content/          # Content collections
│   │   ├── blog/         # Blog posts (each in own directory)
│   │   └── projects/     # Project data
│   ├── layouts/          # Astro layout components
│   ├── pages/            # Astro pages (file-based routing)
│   │   ├── blog/
│   │   └── projects/
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── astro.config.mjs      # Astro configuration
├── tailwind.config.cjs   # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Components Specification

### Terminal Component
The central interactive element of the portfolio.

#### State Management
- `currentDisplay`: Object containing current terminal display state
- `responses`: Array of historical responses
- `currentResponseIndex`: Current position in response history
- `input`: Current input value
- `isProcessing`: Loading state flag

#### Key Functions
- `handleCommand()`: Process user commands and queries
- `generateRAGResponse()`: Interface with backend API for RAG responses
- `navigateResponses()`: Navigate through response history
- `handleInputChange()`: Update input field state
- `handleKeyDown()`: Process keyboard shortcuts and navigation

#### Responsive Adaptation
- Device detection for optimized content delivery
- Condensed UI on mobile devices
- Touch-friendly controls on mobile
- Responsive text sizing and spacing

#### Accessibility Features
- Full keyboard navigation
- ARIA labels for interactive elements
- Focus management
- Screen reader announcements for terminal activities

### Skills Network Visualization
Interactive visualization of interconnected skills and technologies.

#### Implementation Approach
- Force-directed graph using D3.js
- Nodes representing skills, edges representing relationships
- Interactive zoom and pan
- Responsive sizing based on container
- Click/hover interactions for detailed information

#### Data Structure
- Nodes with categorization, level, and relationships
- Edge weights representing relationship strengths
- Metadata for additional information display

### Content Components

#### Blog System
- Integration with Astro's content collections
- Support for MDX for interactive blog elements
- Frontmatter schema for consistent metadata
- Code syntax highlighting
- Image optimization pipeline

#### Project Showcase
- Filterable project gallery
- Detailed project pages with image carousels
- Technology tag system
- Dynamic content loading

## State Management

### Local Component State
- Use React's `useState` and `useEffect` for component-specific state
- Implement custom hooks for reusable state logic

### Application State
- Implement context providers for shared state when needed
- Consider using Astro's global state management for minimal client-side state

### Persistence
- Use localStorage for terminal history persistence
- Implement session management for continuing interrupted sessions

## API Integration

### Service Layer
Create a dedicated service layer to handle all backend communication.

```typescript
// Example API service structure (not complete code)
export const terminalApiService = {
  async askQuestion(question: string): Promise<string> {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      if (!response.ok) throw new Error('Network response error');
      
      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
```

### Error Handling Strategy
- Implement consistent error handling across API requests
- Provide meaningful error messages to users
- Implement retry logic for transient failures
- Log errors for debugging

## Responsive Design Strategy

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: ≥ 1024px

### Mobile-First Approach
- Design core UI for mobile devices first
- Progressively enhance for larger screens
- Use Tailwind's responsive modifiers consistently
- Test on actual devices, not just emulators

### Content Adaptation
- Content variations based on screen size
- Shortened responses on mobile devices
- Alternative layouts for complex visualizations
- Touch-friendly targets (minimum 44x44px)

## Performance Optimization

### Initial Load Performance
- Route-based code splitting
- Critical CSS inlining
- Font optimization (subset, display swap)
- Image optimization pipeline
- Preload critical assets

### Runtime Performance
- Virtualization for long lists
- Debouncing user inputs
- Optimizing animations for 60fps
- Lazy loading off-screen content

### Metrics & Monitoring
- Core Web Vitals targets:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Custom performance markers for key interactions

## Accessibility Implementation

### Standards Compliance
- WCAG 2.1 AA compliance target
- WAI-ARIA implementation for custom components
- Regular automated accessibility testing

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts with appropriate aria-labels

### Screen Reader Support
- Semantic HTML structure
- Appropriate ARIA roles and properties
- Dynamic content announcements
- Alternative text for all images

## Build & Deployment Pipeline

### Development Environment
- Local development server with fast refresh
- Environment variable management
- Integration with backend services

### Build Process
- Astro build optimization
- Asset optimization (images, fonts, CSS, JS)
- TypeScript compilation and checking
- Code linting and formatting
- Bundle size analysis and optimization

### CI/CD Integration
- GitHub Actions workflow
- Automated testing prior to deployment
- Preview environments for PRs
- Automated deployment to production

### Deployment Targets
- Primary: Digital Ocean App Platform
- Static assets served via CDN
- API proxying to backend services

## Testing Strategy

### Unit Testing
- Component testing with Vitest
- Focus on business logic and utility functions
- Mock external dependencies

### Integration Testing
- Testing component interactions
- API service mocking
- User flow validation

### Visual Regression Testing
- Screenshot comparisons across breakpoints
- Component state comparisons
- UI consistency validation

### Accessibility Testing
- Automated a11y testing in CI pipeline
- Manual screen reader testing
- Keyboard navigation testing

## Security Considerations

### Content Security Policy
- Strict CSP implementation
- No inline scripts
- Controlled external resource loading

### Input Validation
- Client-side validation for immediate feedback
- Sanitization of user inputs
- Protection against XSS attacks

### API Security
- CORS configuration
- Authentication token management
- API request rate limiting

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari and Android Chrome (latest 2 versions)

## Terminal Implementation Details

### Core Terminal Component

The Terminal component will be the central interactive element, with these key architectural considerations:

1. **State Management**
   - Maintain command history and responses
   - Track current display state
   - Handle loading and error states

2. **Input Handling**
   - Command parsing and routing
   - Natural language query detection
   - Keyboard shortcut handling

3. **Output Rendering**
   - Styled terminal-like output
   - Typewriter effect for responses
   - Support for rich text formatting

4. **Command System**
   - Built-in command handlers
   - Help system
   - Command suggestions

### Device-Specific Adaptations

The terminal needs significant adaptations for different devices:

1. **Desktop Optimizations**
   - Keyboard shortcuts
   - Rich command suggestions
   - Full terminal aesthetics

2. **Mobile Optimizations**
   - Touch-friendly interface
   - Shorter responses
   - Simplified visualization
   - Optimized keyboard experience

### Terminal UI States

The terminal UI will have several primary states:

1. **Welcome State**
   - ASCII art logo
   - Brief introduction
   - Initial command suggestions

2. **Command Entry State**
   - Command prompt
   - Input field
   - Command history access

3. **Response State**
   - Formatted response text
   - Loading animation during processing
   - Error handling for failed requests

4. **Navigation State**
   - History browsing controls
   - "Previous/Next" navigation
   - Position indicator

## Blog Implementation

### Content Structure
- Each blog post in its own directory
- Markdown files with frontmatter
- Co-located assets with posts

### Frontmatter Schema
```typescript
interface BlogFrontmatter {
  title: string;
  date: Date;
  author: string;
  description: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}
```

### Content Processing Pipeline
1. Markdown parsing with remark
2. Code syntax highlighting with Shiki
3. Image optimization with Astro's built-in optimizer
4. RSS feed generation

### Blog Features
- Tag filtering and categorization
- Search functionality
- Related posts suggestions
- Reading time estimation

## Skills Network Visualization

### Data Structure
The skills network will be based on a structured data model:

```typescript
interface SkillNode {
  id: string;
  name: string;
  group: SkillGroup;
  level: SkillLevel;
  description: string;
  radius: number;
  color: string;
}

interface SkillLink {
  source: string;
  target: string;
  strength: number;
}

type SkillGraph = {
  nodes: SkillNode[];
  links: SkillLink[];
};
```

### Visualization Techniques
- Force-directed layout for natural clustering
- Color coding by skill category
- Node sizing by proficiency level
- Interactive zooming and panning
- Hover/click for detailed information

### Performance Considerations
- Canvas-based rendering for large graphs
- Throttled interaction events
- Limited animation on mobile
- Progressive detail loading

## Deployment and Infrastructure

### Hosting Configuration
- Static site hosted on Digital Ocean App Platform
- CDN configuration for asset serving
- API proxying to backend services

### Environment Configuration
- Development, staging, and production environments
- Environment variable management
- Feature flags for staged rollouts

### Monitoring and Analytics
- Core Web Vitals monitoring
- Error tracking with appropriate service
- Custom event tracking
- User engagement analytics

## Development Workflow

### Local Development
- Development server with hot module replacement
- Backend service proxying
- Environment variable management

### Code Standards
- ESLint configuration for code quality
- Prettier for consistent formatting
- TypeScript strict mode
- Component documentation requirements

### Pull Request Process
- Feature branch workflow
- PR template with checklist
- Required status checks
- Preview environment generation

## Appendix

### Dependencies
- Core dependencies and their purposes
- Dev dependencies and build tools
- Version management strategy

### Performance Budgets
- Bundle size limits
- Loading time targets
- Animation performance metrics

### Accessibility Checklist
- Required ARIA attributes
- Keyboard navigation requirements
- Color contrast requirements
- Screen reader testing checklist