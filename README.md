# Terminal Portfolio with Interactive Resume Game

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![React](https://img.shields.io/badge/React-18.3+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A revolutionary portfolio website that combines terminal aesthetics with an interactive resume game and AI-powered assistant. Built with modern React, PixiJS game engine, and designed for maximum engagement and accessibility.

## 🎮 Interactive Resume Game

Experience professional background through gameplay! Navigate a physics-based platformer where collecting items reveals career milestones, education achievements, and personal facts.

**Game Features:**
- **Physics Engine:** Realistic movement with Matter.js
- **Progressive Disclosure:** Resume information unlocked through gameplay
- **Responsive Controls:** WASD/Arrow keys on desktop, touch controls on mobile
- **Achievement System:** Track progress and completion
- **Accessibility:** Keyboard-only navigation with screen reader support

## 🤖 AI-Powered Terminal Interface

Ask natural language questions about experience, skills, and projects through an intelligent terminal interface powered by RAG (Retrieval Augmented Generation) technology.

**Terminal Features:**
- **Natural Language Processing:** Ask questions in plain English
- **Contextual Responses:** Answers based on resume, blog posts, and project data
- **Command History:** Navigate through previous interactions
- **Mobile Optimized:** Touch-friendly interface for all devices

## ✨ Key Features

- 🎯 **Interactive Resume Game** - Unique gamified experience for exploring professional background
- 🖥️ **Terminal Interface** - Command-line inspired interaction with AI assistant
- 📱 **Mobile-First Design** - Fully responsive across all devices
- ⌨️ **Keyboard Navigation** - Complete accessibility with keyboard-only control
- 🎨 **Modern UI/UX** - Dark theme with terminal aesthetics and smooth animations
- 📝 **Blog System** - Technical articles with syntax highlighting
- 🔗 **Project Showcase** - Interactive portfolio with live demos and GitHub integration
- 🕸️ **Skills Visualization** - Force-directed graph showing technology relationships
- 🚀 **Performance Optimized** - Fast loading with code splitting and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3+ with TypeScript 5.5+
- **Build Tool:** Vite 5.4+ with SWC compiler
- **Styling:** Tailwind CSS 3.4+ with custom design system
- **UI Components:** shadcn/ui, Radix UI primitives
- **Game Engine:** PixiJS 7.4+ (2D rendering) + Matter.js 0.19+ (physics)
- **Animations:** Framer Motion 12.6+
- **Routing:** React Router DOM 6.26+
- **Data Visualization:** React Force Graph 2D
- **Content:** React Markdown with syntax highlighting

### Backend (Planned)
- **Framework:** FastAPI with Pydantic
- **AI/ML:** LangChain for RAG implementation
- **Database:** Chroma vector database
- **LLM Provider:** OpenRouter
- **Package Manager:** Poetry

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode
- **Development Server:** Vite with HMR

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/terminal-rag-portfolio.git
cd terminal-rag-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Deployment
npm run build:dev    # Build in development mode
```

## 📁 Project Structure

```
terminal-rag-portfolio/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── blog/        # Blog-related components
│   │   │   ├── contact/     # Contact page components
│   │   │   ├── projects/    # Project showcase components
│   │   │   ├── resume/      # Resume and game components
│   │   │   │   ├── ResumeGame.tsx      # Main game component
│   │   │   │   ├── GameDialog.tsx      # Item collection dialog
│   │   │   │   ├── useGameLogic.ts     # Game logic hook
│   │   │   │   └── ...
│   │   │   ├── skills/      # Skills visualization
│   │   │   ├── terminal/    # Terminal interface components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── data/            # Static data and content
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx          # Main application
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── tailwind.config.ts   # Tailwind configuration
│
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── config.py        # Application configuration
│   │   ├── models.py        # Pydantic models (requests/responses)
│   │   ├── rag_agent.py     # PydanticAI agent setup
│   │   ├── content_processor.py # Document processing & ingestion
│   │   ├── api.py           # API endpoints
│   │   └── data/
│   │       ├── chroma/      # ChromaDB persistent storage
│   │       └── content/     # Raw content files (manual upload)
│   │           ├── resume/  # Resume PDFs, docs
│   │           ├── projects/ # Project documentation
│   │           ├── blogs/   # Blog posts
│   │           └── linkedin/ # LinkedIn exports
│   ├── tests/               # Backend tests
│   ├── scripts/             # Utility scripts
│   ├── pyproject.toml       # uv project configuration
│   └── .env.example         # Environment variables template
│
├── shared/                   # Shared resources
│   ├── types/               # Shared TypeScript/Python types
│   ├── constants/           # Shared constants
│   └── schemas/             # API schemas
│
├── docs/                     # Project documentation
│   ├── PRD.md               # Product Requirements Document
│   ├── frontend-spec.md     # Frontend Technical Specification
│   ├── ui-ux-spec.md        # UI/UX Specification
│   ├── backend-spec.md      # Backend Technical Specification
│   ├── api/                 # API documentation
│   ├── deployment/          # Deployment guides
│   └── development/         # Development guides
│
├── scripts/                  # Project-wide scripts
│   ├── setup.sh             # Initial setup script
│   ├── deploy.sh            # Deployment script
│   └── migrate.sh           # Migration script
│
├── .github/                  # GitHub workflows
│   └── workflows/
│       ├── frontend.yml     # Frontend CI/CD
│       ├── backend.yml      # Backend CI/CD
│       └── deploy.yml       # Deployment workflow
│
├── package.json             # Root package.json for scripts
├── README.md                # This file
├── .gitignore              # Git ignore rules
└── railway.toml            # Railway deployment config
```

## 🎮 Game Controls

### Desktop
- **Movement:** WASD or Arrow keys
- **Jump:** Spacebar, W, or Up arrow
- **Duck:** S or Down arrow
- **Dialog:** Enter to close item dialogs

### Mobile
- **Touch Controls:** Tap and hold for movement
- **Jump:** Tap jump button
- **Duck:** Tap duck button
- **Responsive:** Optimized for portrait and landscape

## 🎯 Usage Examples

### Playing the Resume Game
1. Navigate to the Resume page
2. Click "Start Game" to begin
3. Use arrow keys or WASD to move
4. Collect briefcase icons (experience), graduation caps (education), and stars (facts)
5. Read detailed information in the popup dialogs
6. Complete the level by collecting all items

### Using the Terminal Interface
1. Visit the Home page
2. Type natural language questions like:
   - "What experience do you have with AI?"
   - "Tell me about your projects"
   - "What technologies do you know?"
3. Navigate through responses with arrow keys
4. Use keyboard shortcuts for quick navigation

## 📊 Performance

- **Initial Load:** < 2 seconds on broadband
- **Game Initialization:** < 1 second
- **Bundle Size:** Optimized with code splitting
- **Accessibility:** WCAG 2.1 AA compliant
- **Mobile Performance:** 60fps animations on modern devices

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
VITE_API_URL=http://localhost:8000
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENVIRONMENT=development
```

### Customization
- **Colors:** Edit `tailwind.config.ts` for theme customization
- **Game Settings:** Modify `src/components/resume/useGameLogic.ts`
- **Content:** Update `src/data/resumeData.ts` for resume information

## 🚀 Deployment

### Railway (Recommended)
```bash
# Build the project
npm run build

# Deploy to Railway
railway up
```

### Other Platforms
- **Vercel:** `vercel --prod`
- **Netlify:** `netlify deploy --prod`
- **GitHub Pages:** Use GitHub Actions workflow

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Roadmap

### Phase 1: RAG Integration (In Progress)
- [ ] FastAPI backend setup
- [ ] Chroma vector database integration
- [ ] Natural language processing
- [ ] Terminal-backend integration

### Phase 2: Advanced Features
- [ ] Voice interaction with Web Speech API
- [ ] Progressive Web App capabilities
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Phase 3: Platform Expansion
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] API for third-party integrations
- [ ] White-label solution

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

#### Frontend Development
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

#### Backend Development (RAG System)
```bash
cd backend
uv sync                    # Install dependencies
uv run uvicorn app.main:app --reload  # Start backend
uv run python scripts/ingest_content.py  # Process content
```

**Content Upload:**
1. Drop files into `backend/app/data/content/` directories
2. Run ingestion script to process into vector database
3. Test RAG queries via API endpoints

### Code Standards
- TypeScript strict mode
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Component testing with React Testing Library

## 📚 Documentation

- **[Product Requirements Document](docs/PRD.md)** - Complete project overview and requirements
- **[Frontend Specification](docs/frontend-spec.md)** - Technical architecture and implementation details
- **[UI/UX Specification](docs/ui-ux-spec.md)** - Design system and user experience guidelines
- **[Backend Specification](docs/backend-spec.md)** - API design and RAG implementation

## 🐛 Troubleshooting

### Common Issues

**Game not loading:**
- Ensure WebGL is enabled in your browser
- Check browser console for JavaScript errors
- Try refreshing the page

**Performance issues:**
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled

**Mobile controls not working:**
- Ensure touch events are enabled
- Try landscape orientation
- Check for browser compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PixiJS** - High-performance 2D WebGL renderer
- **Matter.js** - 2D physics engine for realistic interactions
- **shadcn/ui** - Beautiful and accessible UI components
- **Radix UI** - Low-level UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **React** - The library for web and native user interfaces

## 📞 Contact

**Sudharsan Ananth**
- Email: [your.email@example.com](mailto:your.email@example.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio-url.com](https://your-portfolio-url.com)

---

**Built with ❤️ and lots of ☕ by Sudharsan Ananth**

*This portfolio showcases the intersection of creativity and technology, demonstrating how traditional professional presentation can be reimagined through interactive experiences and modern web technologies.*
