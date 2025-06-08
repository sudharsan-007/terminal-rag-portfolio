# Terminal Portfolio

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

A unique, terminal-inspired portfolio with an AI-powered assistant that can answer questions about my experience, skills, and projects. Built with Astro, React, FastAPI, and a RAG-based knowledge engine.

![Terminal Portfolio Demo](./screenshots/terminal-demo.png)

## Features

- 🖥️ **Terminal Interface** - Interactive command-line experience
- 🤖 **AI-Powered RAG System** - Ask natural language questions about my background
- 🌟 **Mobile-First Design** - Fully responsive from mobile to desktop
- ⌨️ **Full Keyboard Navigation** - Complete keyboard control and shortcuts
- 📝 **Blog System** - Markdown-based technical blog
- 🔄 **Auto-updating Knowledge** - Stays current with my latest content

## Live Demo

Visit the live portfolio at: [https://example.com](https://example.com)

## Tech Stack

### Frontend
- **Astro** - Static site generation framework
- **React** - Interactive components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **D3.js** - Interactive data visualizations

### Backend
- **FastAPI** - Python API framework
- **LangChain** - RAG framework
- **Pydantic** - Data validation and settings management
- **Chroma** - Vector database for embeddings
- **OpenAI API** - For embeddings and text generation

## Project Structure

```
terminal-portfolio/
├── frontend/                # Astro-based frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── terminal/    # Terminal interface components
│   │   ├── content/         # Blog posts and project data
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # Astro pages
│   │   └── services/        # API services
│   ├── public/              # Static assets
│   └── README.md            # Frontend-specific documentation
│
├── backend/                 # FastAPI-based backend
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── rag/             # RAG implementation
│   │   ├── ingestion/       # Content ingestion
│   │   ├── models/          # Data models
│   │   └── scrapers/        # Content scrapers
│   ├── data/                # Data storage
│   ├── scripts/             # Utility scripts
│   └── README.md            # Backend-specific documentation
│
├── docs/                    # Project documentation
│   ├── prd.md               # Product Requirements Document
│   ├── frontend-spec.md     # Frontend Technical Specification
│   └── backend-spec.md      # Backend Technical Specification
│
├── screenshots/             # Project screenshots
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key
- LinkedIn account (for scraping)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Add your OpenAI API key to .env

# Start development server
uvicorn app.main:app --reload
```

## Blog Management

This project uses a self-contained blog post structure, where each post exists in its own directory with all associated assets.

### Blog Structure

```
frontend/src/content/blog/
├── post-slug-1/             # Post directory
│   ├── index.md             # Post content
│   └── image.jpg            # Post image
├── post-slug-2/             # Another post
│   ├── index.md
│   └── diagram.svg
```

### Creating a New Post

1. Create a new directory under `frontend/src/content/blog/`
2. Add an `index.md` file with the following frontmatter structure:

```md
---
title: Your Blog Post Title
date: 2025-03-26
author: Sudharsan Ananth
tags: [tag1, tag2, tag3]
description: A brief description of your post
image: ./screenshot.jpg
---

Your blog post content goes here...
```

3. Add any images or assets directly to the post directory
4. Reference images using relative paths (e.g., `![Alt text](./image.jpg)`)

### Blog Features

- **Automatic listing** on the blog index page
- **Tag filtering** for finding related content
- **Reading time estimation**
- **Code syntax highlighting**
- **Responsive images**

## RAG System

The RAG (Retrieval Augmented Generation) system powers the terminal's ability to answer questions about my experience, skills, and projects.

### Knowledge Sources

The system automatically indexes and retrieves information from:
- My resume (professional experience, education, skills)
- Blog posts (technical content and thoughts)
- LinkedIn posts (professional updates and insights)
- Project descriptions (technical details and outcomes)

### Updating the Knowledge Base

The knowledge base updates automatically in two ways:

1. **Content changes**: When new blog posts or project information is added to the repository
2. **Scheduled updates**: A cron job pulls LinkedIn content every 2 days

To manually update the knowledge base:

```bash
cd backend
source venv/bin/activate
python -m scripts.update_rag
```

## Deployment

### Frontend Deployment

The frontend is deployed to Digital Ocean App Platform:

```bash
# Build the frontend
cd frontend
npm run build

# Deploy using GitHub integration on Digital Ocean
# (See Digital Ocean documentation for details)
```

### Backend Deployment

The backend is deployed as a Docker container:

```bash
# Build and deploy using Docker Compose
cd backend
docker-compose up -d --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- **Frontend**: Follow ESLint and Prettier configurations
- **Backend**: Follow PEP 8 and use type annotations
- **Commits**: Use conventional commit messages

## Development Roadmap

- [ ] Advanced visualization of project connections
- [ ] Voice input for terminal commands
- [ ] Multi-language support
- [ ] Interactive project demos
- [ ] Enhanced mobile experience

## Performance Optimization

The project includes several performance optimizations:

- **Frontend**:
  - Astro's partial hydration for minimal JS
  - Image optimization pipeline
  - Code splitting and lazy loading
  - Critical CSS inlining

- **Backend**:
  - Response caching
  - Efficient embedding strategies
  - Optimized vector search

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Sudharsan Ananth - [sudharsan.ananth@gmail.com](mailto:sudharsan.ananth@gmail.com)

LinkedIn: [linkedin.com/in/sudharsan-ananth](https://www.linkedin.com/in/sudharsan-ananth)  
GitHub: [github.com/sudharsan-007](https://github.com/sudharsan-007)  
YouTube: [youtube.com/channel/UC0k9uSOQ5DkLCpBw8ZgE2BQ](https://www.youtube.com/channel/UC0k9uSOQ5DkLCpBw8ZgE2BQ)

## Acknowledgments

- Terminal UI inspired by iTerm2 and Hyper
- RAG system based on LangChain's RetrievalQA framework
- Astro team for their excellent documentation
- OpenAI for their embedding and completion APIs