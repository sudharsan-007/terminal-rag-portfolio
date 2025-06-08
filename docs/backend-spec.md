# Backend Technical Specification
# Terminal Portfolio RAG System

## Document Information
- **Document Owner:** Sudharsan Ananth
- **Date Created:** March 26, 2025
- **Last Updated:** June 8, 2025
- **Status:** Current Implementation

## Overview
This document outlines the technical architecture, implementation details, and design decisions for the backend system of the Terminal Portfolio project. The backend provides a RAG (Retrieval Augmented Generation) system that allows users to query information about Sudharsan's professional background, skills, and projects through natural language interactions.

## Technology Stack

### Core Framework
- **Framework:** FastAPI v0.104+
- **Python Version:** 3.11+
- **Package Manager:** uv (Ultra-fast Python package installer and resolver)
- **ASGI Server:** Uvicorn with standard extras

### AI & RAG Framework
- **AI Framework:** PydanticAI v0.0.13+ (Agent framework with Pydantic integration)
- **Vector Database:** ChromaDB v0.4.18+
- **Embeddings:** OpenAI text-embedding-3-small
- **LLM:** OpenAI GPT-4o (via PydanticAI)
- **Text Processing:** tiktoken for token counting

### Data Processing
- **Document Processing:** PyPDF2, python-docx, markdown
- **Data Manipulation:** pandas, numpy
- **File Handling:** aiofiles for async file operations

### Database & Storage
- **Vector Storage:** ChromaDB with persistent storage
- **Session Management:** In-memory (Redis for production)
- **File Storage:** Local filesystem (S3 for production)

### Development & Testing
- **Testing:** pytest with asyncio support
- **Code Quality:** black, isort, flake8, mypy
- **Environment:** python-dotenv for configuration

## Architecture Overview

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI       │    │   PydanticAI    │
│   Terminal      │◄──►│   Backend       │◄──►│   Agent         │
│   Interface     │    │   API Layer     │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Content       │    │   ChromaDB      │
                       │   Processing    │    │   Vector Store  │
                       │   Pipeline      │    │                 │
                       └─────────────────┘    └─────────────────┘
```

### Directory Structure (Simplified)

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Application configuration
│   ├── models.py               # Pydantic models (requests/responses)
│   ├── rag_agent.py            # PydanticAI agent setup
│   ├── content_processor.py    # Document processing & ingestion
│   ├── api.py                  # API endpoints
│   └── data/
│       ├── chroma/             # ChromaDB persistent storage
│       └── content/            # Raw content files (manual upload)
│           ├── resume/         # Resume PDFs, docs
│           ├── projects/       # Project documentation
│           ├── blogs/          # Blog posts
│           └── linkedin/       # LinkedIn exports
├── tests/
│   ├── test_api.py
│   ├── test_rag.py
│   └── test_content.py
├── scripts/
│   └── ingest_content.py       # Manual content ingestion
├── pyproject.toml              # uv project configuration
├── uv.lock                     # uv lock file
└── .env.example                # Environment variables template
```

## Core Components

### 1. PydanticAI Agent System

#### Agent Configuration
```python
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, Field

class RAGDependencies:
    """Dependencies injected into the RAG agent"""
    vector_store: ChromaDB
    content_processor: ContentProcessor
    user_session: Optional[str] = None

class RAGResponse(BaseModel):
    """Structured response from the RAG agent"""
    answer: str = Field(description="Direct answer to the user's question")
    sources: List[str] = Field(description="Source documents used")
    confidence: float = Field(description="Confidence score 0-1", ge=0, le=1)
    follow_up_questions: List[str] = Field(description="Suggested follow-up questions")

rag_agent = Agent(
    'openai:gpt-4o',
    deps_type=RAGDependencies,
    output_type=RAGResponse,
    system_prompt=(
        "You are Sudharsan Ananth's AI assistant. Answer questions about his "
        "professional background, skills, projects, and experience using the "
        "provided context. Be accurate, helpful, and conversational."
    ),
)
```

#### Agent Tools
```python
@rag_agent.tool
async def search_resume_content(
    ctx: RunContext[RAGDependencies], 
    query: str, 
    content_type: str = "all"
) -> List[Dict]:
    """Search through resume and professional content"""
    return await ctx.deps.vector_store.similarity_search(
        query, content_type=content_type, k=5
    )

@rag_agent.tool
async def get_project_details(
    ctx: RunContext[RAGDependencies], 
    project_name: str
) -> Dict:
    """Get detailed information about a specific project"""
    return await ctx.deps.content_processor.get_project_by_name(project_name)
```

### 2. Content Processing Pipeline

#### Document Ingestion
- **PDF Processing:** Extract text from resume PDFs, project documentation
- **Markdown Processing:** Process blog posts and project READMEs
- **LinkedIn Data:** Process exported LinkedIn profile and posts
- **Chunking Strategy:** Semantic chunking with overlap for context preservation

#### Content Types
```python
class ContentType(str, Enum):
    RESUME = "resume"
    PROJECT = "project"
    BLOG = "blog"
    LINKEDIN_POST = "linkedin_post"
    LINKEDIN_PROFILE = "linkedin_profile"
    SKILL = "skill"
    EXPERIENCE = "experience"

class ContentChunk(BaseModel):
    id: str
    content: str
    content_type: ContentType
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None
    created_at: datetime
```

### 3. Vector Database (ChromaDB)

#### Collection Strategy
- **Main Collection:** `sudharsan_portfolio` - All content types
- **Metadata Filtering:** Filter by content_type, date, project_name, etc.
- **Embedding Model:** OpenAI text-embedding-3-small (1536 dimensions)

#### Retrieval Strategy
```python
async def hybrid_search(
    query: str, 
    content_types: List[ContentType] = None,
    k: int = 5
) -> List[ContentChunk]:
    """
    Hybrid search combining:
    1. Semantic similarity (vector search)
    2. Keyword matching (metadata filtering)
    3. Recency weighting for time-sensitive content
    """
```

### 4. API Endpoints

#### Core Endpoints
```python
# Health and Status
GET  /health                    # Health check
GET  /health/detailed          # Detailed system status

# RAG Interaction
POST /api/v1/ask               # Main Q&A endpoint
GET  /api/v1/suggestions       # Get suggested questions
POST /api/v1/feedback          # Submit response feedback

# Content Management
POST /api/v1/content/ingest    # Trigger content ingestion
GET  /api/v1/content/status    # Get ingestion status
GET  /api/v1/content/stats     # Get content statistics
```

#### Request/Response Models
```python
class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AskResponse(BaseModel):
    answer: str
    sources: List[SourceDocument]
    confidence: float
    response_time_ms: int
    follow_up_questions: List[str]
    session_id: str
```

## Content Management

### Manual Content Upload Directory
Simply drop your files into these directories:

```
backend/app/data/content/
├── resume/                     # Drop resume PDFs here
├── projects/                   # Drop project docs/READMEs here  
├── blogs/                      # Drop blog posts (MD/PDF) here
└── linkedin/                   # Drop LinkedIn exports here
```

### Content Ingestion Command
```bash
# Process all content in the directories above
uv run python scripts/ingest_content.py

# Process specific content type only
uv run python scripts/ingest_content.py --type resume
```

## Configuration Management

### Environment Variables
```python
class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Terminal Portfolio RAG"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    OPENAI_CHAT_MODEL: str = "gpt-4o"
    
    # ChromaDB Configuration
    CHROMA_PERSIST_DIRECTORY: str = "./app/data/chroma"
    CHROMA_COLLECTION_NAME: str = "sudharsan_portfolio"
    
    # Content Configuration
    CONTENT_DIRECTORY: str = "./app/data/content"
    MAX_CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Performance Configuration
    MAX_CONCURRENT_REQUESTS: int = 10
    RESPONSE_TIMEOUT_SECONDS: int = 30
    CACHE_TTL_SECONDS: int = 3600
    
    class Config:
        env_file = ".env"
```

## Performance Considerations

### Optimization Strategies
1. **Embedding Caching:** Cache embeddings for frequently accessed content
2. **Response Caching:** Cache responses for common questions
3. **Async Processing:** Use async/await throughout the pipeline
4. **Connection Pooling:** Reuse HTTP connections for OpenAI API calls
5. **Batch Processing:** Process multiple documents in batches during ingestion

### Monitoring & Observability
- **Request Metrics:** Response time, success rate, error rate
- **Usage Tracking:** Token usage, API call frequency
- **Content Metrics:** Document count, embedding freshness
- **Health Checks:** Database connectivity, API availability

## Security Considerations

### API Security
- **Rate Limiting:** Implement request rate limiting
- **Input Validation:** Strict validation of all inputs
- **CORS Configuration:** Proper CORS setup for frontend integration
- **API Key Management:** Secure handling of OpenAI API keys

### Data Privacy
- **Content Sanitization:** Remove sensitive information during ingestion
- **Session Management:** Secure session handling
- **Audit Logging:** Log all interactions for monitoring

## Future Enhancements

### Planned Features
1. **Web Scraping:** Automated LinkedIn and GitHub data collection using Playwright
2. **Real-time Updates:** WebSocket support for real-time Q&A
3. **Multi-modal Support:** Image and video content processing
4. **Advanced Analytics:** User interaction analytics and insights
5. **A/B Testing:** Response quality testing and optimization

### Scalability Considerations
- **Horizontal Scaling:** Multi-instance deployment support
- **Database Sharding:** ChromaDB collection partitioning
- **CDN Integration:** Static content delivery optimization
- **Caching Layers:** Redis for distributed caching

## Development Workflow

### Package Management with uv
```bash
# Install dependencies
uv sync

# Add new dependency
uv add fastapi

# Add development dependency
uv add --dev pytest

# Run application
uv run uvicorn app.main:app --reload

# Run tests
uv run pytest

# Code formatting
uv run black app/
uv run isort app/
```

### Testing Strategy
- **Unit Tests:** Individual component testing
- **Integration Tests:** API endpoint testing
- **Performance Tests:** Load testing with realistic data
- **E2E Tests:** Full pipeline testing from ingestion to response

## Deployment Configuration

### Docker Configuration
```dockerfile
FROM python:3.11-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-cache

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway Deployment
- **Build Command:** `uv sync --frozen`
- **Start Command:** `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:** OpenAI API key, database configuration
- **Health Check:** `/health` endpoint monitoring

## API Documentation

### OpenAPI Integration
- **Automatic Documentation:** FastAPI auto-generates OpenAPI specs
- **Interactive Docs:** Swagger UI available at `/docs`
- **ReDoc Documentation:** Alternative docs at `/redoc`
- **Schema Export:** OpenAPI JSON available at `/openapi.json`

This specification provides a comprehensive foundation for implementing a robust, scalable RAG system using modern Python tools and frameworks.