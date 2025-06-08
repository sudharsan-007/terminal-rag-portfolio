# Backend Technical Specification
# Terminal Portfolio RAG System

## Overview
This document outlines the technical architecture, components, and implementation details for the backend of the Terminal Portfolio project. The backend will provide an API for the frontend terminal interface to query information about Sudharsan's skills, projects, and experience using a Retrieval Augmented Generation (RAG) system.

## Technology Stack
- **Framework**: FastAPI v0.100+
- **Data Validation**: Pydantic v2.0+
- **RAG Framework**: LangChain v0.1.0+
- **Vector Database**: Chroma v0.4.0+
- **AI/LLM Integration**: OpenAI API (via LangChain)
- **Content Processing**: Markdown, Frontmatter, BeautifulSoup
- **Web Scraping**: Selenium (for LinkedIn content)
- **Authentication**: JWT-based with OAuth2
- **Deployment**: Docker, Docker Compose

## Architecture

### Core Architecture Principles
- **Modular Design**: Clear separation of concerns for maintainability
- **API-First Development**: Well-defined API contracts
- **Fault Tolerance**: Graceful error handling and fallbacks
- **Statelessness**: Avoid server-side session state
- **Security by Design**: Security considered at all architectural levels

### System Components
1. **API Layer**: FastAPI endpoints for client interaction
2. **RAG Engine**: Core logic for retrieval and generation
3. **Data Ingestion**: Processing various content sources
4. **Vector Database**: Storage for embeddings and content
5. **Scheduled Updates**: Regular content refresh system

### Folder Structure
```
backend/
├── app/
│   ├── main.py                # Application entry point
│   ├── api/                   # API endpoints
│   │   ├── __init__.py
│   │   ├── router.py          # API router
│   │   └── endpoints/         # Endpoint implementations
│   ├── rag/                   # RAG implementation
│   │   ├── __init__.py
│   │   ├── engine.py          # Core RAG logic
│   │   └── prompting.py       # Prompt engineering
│   ├── models/                # Pydantic models
│   │   ├── __init__.py
│   │   ├── api.py             # API request/response models
│   │   └── content.py         # Content data models
│   ├── ingestion/             # Data ingestion components
│   │   ├── __init__.py
│   │   ├── resume.py          # Resume processor
│   │   └── blog.py            # Blog content processor
│   ├── scrapers/              # Web scraping components
│   │   ├── __init__.py
│   │   └── linkedin.py        # LinkedIn scraper
│   ├── data/                  # Data storage
│   │   ├── sources/           # Raw content sources
│   │   └── processed/         # Processed data
│   ├── utils/                 # Utility functions
│   │   ├── __init__.py
│   │   ├── logging.py         # Logging configuration
│   │   └── security.py        # Security utilities
│   └── config.py              # Application configuration
├── scripts/                   # Utility scripts
│   └── update_rag.py          # RAG database updater
├── tests/                     # Test suite
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
└── requirements.txt           # Python dependencies
```

## API Specification

### Endpoints

#### 1. Question Answering
```
POST /ask
```

**Request Body**:
```json
{
  "question": "What is Sudharsan's experience with embedded systems?"
}
```

**Response Body**:
```json
{
  "answer": "Sudharsan has extensive experience with embedded systems...",
  "sources": [
    {
      "type": "resume",
      "section": "Experience",
      "relevance": 0.92
    }
  ]
}
```

**Status Codes**:
- 200: Successful response
- 400: Invalid question format
- 422: Unable to process question
- 500: Server error

#### 2. Health Check
```
GET /health
```

**Response Body**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 360000
}
```

#### 3. System Information
```
GET /info
```

**Response Body**:
```json
{
  "name": "Terminal Portfolio RAG System",
  "version": "1.0.0",
  "lastUpdated": "2025-03-26T12:00:00Z",
  "contentSources": [
    "resume",
    "linkedin",
    "blog"
  ]
}
```

### Authentication
- API keys for backend protection
- Rate limiting for public endpoints
- CORS configuration for frontend access

## RAG System Implementation

### RAG Engine

The RAG Engine will handle the core functionality of retrieving relevant content and generating responses.

#### Components
1. **Embedding Model**: Creates vector representations of text
2. **Vector Store**: Stores and retrieves embeddings
3. **Retriever**: Finds relevant content for queries
4. **Generator**: Creates responses using retrieved content
5. **Prompt Templates**: Structures context and queries for LLM

#### Information Flow
1. Receive query from API endpoint
2. Convert query to embedding vector
3. Retrieve relevant documents from vector store
4. Format prompt with retrieved context
5. Generate response using LLM
6. Format and return response to client

#### Performance Considerations
- Caching of common queries
- Optimized chunking strategies
- Efficient vector similarity search
- Prompt optimization for token efficiency

### Data Ingestion System

The data ingestion system will process and index content from various sources.

#### Content Sources
1. **Resume**: Markdown file with structured sections
2. **Blog Posts**: Markdown files with frontmatter
3. **LinkedIn Posts**: Scraped content from LinkedIn profile
4. **Project Descriptions**: Structured project data

#### Processing Pipeline
1. Extract content from source
2. Clean and normalize text
3. Split into appropriate chunks
4. Generate and store embeddings
5. Index metadata for retrieval

#### Chunking Strategy
- Resume: Section-based chunking
- Blog posts: Paragraph-based chunking with overlap
- LinkedIn posts: Post-based chunking
- Project descriptions: Feature-based chunking

### Vector Database Integration

Chroma will be used as the vector database for storing and retrieving embeddings.

#### Setup and Configuration
- Persistent storage for production
- In-memory for development/testing
- Regular backup strategy

#### Collection Structure
- Collection per content type
- Metadata for source tracking
- Efficient indexing for fast retrieval

#### Query Optimization
- K-nearest neighbor search configuration
- Metadata filtering for context-aware retrieval
- Score thresholding for relevance

### LinkedIn Scraping System

A scheduled scraper will keep the knowledge base updated with the latest LinkedIn content.

#### Implementation Approach
- Selenium-based scraper with headless Chrome
- Authentication handling
- Content extraction with BeautifulSoup
- Rate limiting and retry logic

#### Data Privacy Considerations
- Only public profile content processed
- Personal information filtering
- Compliance with LinkedIn terms of service

#### Scheduling
- Bi-daily updates (every 2 days)
- Incremental updates to avoid duplicates
- Failure recovery mechanisms

## Security Implementation

### API Security
- API key authentication
- Request validation
- Rate limiting
- Input sanitization

### Data Security
- Encrypted storage for sensitive data
- Secure credential management
- Regular security audits

### Infrastructure Security
- Container security best practices
- Network isolation
- Regular dependency updates
- Principle of least privilege

## Performance Optimization

### Response Time Targets
- Average response time < 1 second
- 95th percentile < 2 seconds
- Timeout handling for long-running queries

### Caching Strategy
- Response caching for common queries
- Embedding caching for frequent terms
- Metadata caching for fast filtering

### Resource Optimization
- Token usage monitoring
- Efficient prompt design
- Batch processing where possible

## Testing Strategy

### Unit Testing
- Component-level tests with pytest
- Mock external dependencies
- Focus on business logic and utilities

### Integration Testing
- API endpoint testing
- Database integration testing
- External service mocking

### Performance Testing
- Load testing for concurrent requests
- Response time benchmarking
- Resource usage monitoring

### Quality Assurance
- Code quality checks with flake8, black
- Type checking with mypy
- Documentation requirements

## Deployment and Operations

### Docker Configuration
```
# Dockerfile highlights (not complete)
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY ./scripts ./scripts

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Configuration
```
# .env variables (example, not comprehensive)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
CHROMA_PERSIST_DIRECTORY=./data/chroma
LOG_LEVEL=INFO
API_KEY=...
```

### Monitoring and Logging
- Structured logging with context
- Error tracking and alerting
- Performance monitoring
- Resource usage tracking

### Backup and Recovery
- Regular vector database backups
- Configuration backups
- Restoration testing procedures

## Content Update Workflow

### Manual Content Updates
1. Update source files in data/sources
2. Run update script: `python -m scripts.update_rag`
3. Verify updates in development environment
4. Deploy to production

### Automated Updates
1. Scheduled script execution via cron
2. LinkedIn content scraping
3. Incremental database updates
4. Update completion notification

## Development Workflow

### Local Development
- Setup with docker-compose
- Hot-reloading for API changes
- Environment variable management
- Vector database persistence

### Code Standards
- PEP 8 compliance
- Type hinting with mypy
- Documentation requirements
- Test coverage targets

### Pull Request Process
- Feature branch workflow
- PR template with checklist
- Required status checks
- Review requirements

## Appendix

### Dependencies
- Critical dependencies and their purposes
- Version pinning strategy
- Dependency update process

### API Documentation
- OpenAPI/Swagger integration
- Documentation hosting
- API versioning strategy

### Error Handling
- Standardized error response format
- Error categorization
- Logging requirements
- Client-friendly error messages

### Performance Benchmarks
- Response time targets
- Throughput expectations
- Resource utilization limits

## Pydantic Models

The system will use Pydantic models for request/response validation and internal data structures.

### API Models

```python
# Example API models (not complete implementation)
from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)

class SourceReference(BaseModel):
    type: str  # e.g., 'resume', 'blog', 'linkedin'
    section: Optional[str] = None
    relevance: float = Field(..., ge=0.0, le=1.0)

class QuestionResponse(BaseModel):
    answer: str
    sources: List[SourceReference] = []
```

### Content Models

```python
# Example content models (not complete implementation)
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl
from typing import Dict, List, Optional, Any

class ContentMetadata(BaseModel):
    source_type: str
    source_id: str
    last_updated: datetime = Field(default_factory=datetime.now)
    section: Optional[str] = None
    tags: List[str] = []
    
class ContentChunk(BaseModel):
    content: str
    metadata: ContentMetadata
    embedding: Optional[List[float]] = None
```

## RAG Implementation Details

### RAG Engine Core

The RAG Engine combines retrieval and generation components:

```python
# Conceptual implementation (not complete code)
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

class RAGEngine:
    def __init__(self, config):
        self.embeddings = OpenAIEmbeddings(
            api_key=config.openai_api_key
        )
        
        self.vectorstore = Chroma(
            collection_name="portfolio_data",
            embedding_function=self.embeddings,
            persist_directory=config.chroma_persist_dir
        )
        
        self.llm = OpenAI(
            api_key=config.openai_api_key,
            model_name=config.model_name,
            temperature=config.temperature
        )
        
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": config.retrieval_k}
            )
        )
    
    async def ask(self, question):
        return await self.qa_chain.arun(question)
```

### Prompt Engineering

Careful prompt engineering will maximize the quality of generated responses:

1. **System Prompt Components**:
   - Identity: Define the system as Sudharsan's portfolio assistant
   - Context: Include relevant retrieved documents
   - Constraints: Set response format and style guidelines
   - Tone: Professional, informative, concise

2. **Prompt Templates**:
   - Use LangChain's PromptTemplate for structured prompts
   - Implement different templates based on query type
   - Include metadata guidance for better context utilization

3. **Output Formatting**:
   - Structured response guidelines
   - Citation format for sources
   - Length constraints based on device type

### Response Adaptation

Responses will be adapted based on context:

1. **Device-Specific Responses**:
   - Mobile: Shorter, more concise responses
   - Desktop: More detailed responses with formatting

2. **Query Type Adaptation**:
   - Technical queries: Include specific technical details
   - Experience queries: Focus on chronology and achievements
   - Project queries: Emphasize technologies and outcomes

## Content Processing Components

### Resume Processor

```python
# Conceptual implementation (not complete code)
import re
from pathlib import Path
from app.models.content import ContentChunk, ContentMetadata

class ResumeProcessor:
    def process(self, file_path: Path) -> list[ContentChunk]:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract sections using regex patterns
        sections = self._extract_sections(content)
        
        chunks = []
        for section_name, section_content in sections.items():
            metadata = ContentMetadata(
                source_type="resume",
                source_id=file_path.stem,
                section=section_name
            )
            
            chunk = ContentChunk(
                content=section_content,
                metadata=metadata
            )
            chunks.append(chunk)
        
        return chunks
    
    def _extract_sections(self, content):
        # Implementation of section extraction
        pass
```

### Blog Processor

```python
# Conceptual implementation (not complete code)
import frontmatter
from pathlib import Path
from app.models.content import ContentChunk, ContentMetadata

class BlogProcessor:
    def process_directory(self, dir_path: Path) -> list[ContentChunk]:
        chunks = []
        
        # Find all blog post directories
        post_dirs = [d for d in dir_path.iterdir() if d.is_dir()]
        
        for post_dir in post_dirs:
            # Find main markdown file (index.md or similar)
            md_files = list(post_dir.glob("*.md"))
            if not md_files:
                continue
                
            main_file = md_files[0]
            chunks.extend(self.process_file(main_file))
            
        return chunks
    
    def process_file(self, file_path: Path) -> list[ContentChunk]:
        # Parse frontmatter and content
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
        
        # Create chunks from content
        # Implementation details...
        
        return chunks
```

### LinkedIn Scraper

```python
# Conceptual implementation (not complete code)
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
from app.models.content import ContentChunk, ContentMetadata

class LinkedInScraper:
    def __init__(self, config):
        self.linkedin_email = config.linkedin_email
        self.linkedin_password = config.linkedin_password
        self.profile_url = config.linkedin_profile_url
    
    def scrape(self) -> list[ContentChunk]:
        # Initialize browser
        options = Options()
        options.add_argument("--headless")
        driver = webdriver.Chrome(options=options)
        
        try:
            # Log in to LinkedIn
            self._login(driver)
            
            # Navigate to profile and scrape content
            posts = self._scrape_posts(driver)
            
            # Convert to ContentChunk objects
            chunks = self._create_chunks(posts)
            
            return chunks
        finally:
            driver.quit()
    
    # Implementation of helper methods...
```

## Database Implementation

### Chroma Vector Database

Chroma will be the primary vector database for RAG functionality:

1. **Initialization and Connection**:
   - Connect using LangChain's Chroma integration
   - Configure for persistent storage in production
   - Set up backup mechanisms

2. **Collection Management**:
   - Create collections for different content types
   - Implement migration strategy for schema changes
   - Optimize for query performance

3. **Query Optimization**:
   - Fine-tune k-nearest neighbor parameters
   - Implement metadata filtering for context
   - Configure distance metrics for embeddings

4. **Maintenance Operations**:
   - Regular compaction and optimization
   - Backup and restore procedures
   - Monitoring for performance issues

### Embedding Strategy

1. **Text Preparation**:
   - Clean and normalize text
   - Remove irrelevant content
   - Handle special characters and formatting

2. **Chunking Strategy**:
   - Content-aware chunking (semantic boundaries)
   - Overlapping chunks for context preservation
   - Variable chunk sizes based on content type

3. **Embedding Generation**:
   - Use OpenAI's text-embedding-ada-002 model
   - Implement fallback embedding models
   - Cache embeddings for efficiency

## Monitoring and Observability

### Logging Strategy

```python
# Logging configuration (conceptual)
import logging
import json
from datetime import datetime

class CustomJSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        if hasattr(record, 'request_id'):
            log_record["request_id"] = record.request_id
            
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)

# Configure logger
def configure_logging():
    logger = logging.getLogger("portfolio_api")
    handler = logging.StreamHandler()
    handler.setFormatter(CustomJSONFormatter())
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
```

### Metrics Collection

1. **API Metrics**:
   - Request count and rate
   - Response times
   - Error rates by type
   - Endpoint usage distribution

2. **RAG Metrics**:
   - Query complexity metrics
   - Retrieval performance
   - Generation quality metrics
   - Token usage tracking

3. **Resource Metrics**:
   - CPU/Memory usage
   - Database performance
   - External API call metrics
   - Rate limit status

### Alerting and Reporting

1. **Alert Conditions**:
   - High error rates
   - Slow response times
   - Failed scheduled tasks
   - Resource exhaustion

2. **Reporting**:
   - Regular performance reports
   - Content update summaries
   - Usage trend analysis
   - Cost optimization recommendations

## Future Enhancements

The following enhancements are planned for future iterations:

1. **Multi-Model Support**:
   - Support for additional LLM providers
   - Model fallback mechanisms
   - Model selection based on query complexity

2. **Advanced Content Processing**:
   - Image content extraction and indexing
   - Code snippet processing
   - Project demo integration

3. **Feedback Loop Implementation**:
   - User feedback collection
   - Response quality tracking
   - Continuous improvement system

4. **Extended Data Sources**:
   - GitHub repository integration
   - Publication indexing
   - Video content transcription and indexing

5. **Performance Optimizations**:
   - More sophisticated caching strategies
   - Query planning and optimization
   - Parallel processing for content updates