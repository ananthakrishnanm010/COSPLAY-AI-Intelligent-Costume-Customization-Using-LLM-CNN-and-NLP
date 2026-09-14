# AI-Powered Brand-Aware Clothing Customization System

A generative AI platform that lets users design personalized clothing using natural-language prompts, while keeping garments true to a selected brand's standard sizing.

## Abstract

Existing fashion platforms mostly offer predefined designs and fixed sizes, leaving little room for personalization. This project lets users describe the garment changes they want — type, color, embroidery, size, specific measurements — in plain language. The system:

1. Parses the prompt with NLP/LLM to extract structured customization data.
2. Looks up the selected brand's standard measurements from a database.
3. Calculates the customized dimensions deterministically, based on the brand's base sizing and the user's requested changes.
4. Feeds the design requirements and calculated measurements to a generative AI image model to produce a visual of the customized garment, based on a reference image.
5. Supports iterative refinement — users can keep adjusting the design with follow-up prompts.

## Problem Statement

Standard sizes vary between brands, and most platforms can't reconcile a user's natural-language customization request with a specific brand's sizing standard. Customers are stuck choosing between rigid presets or manual, error-prone measurement entry. This system combines NLP, a brand-specific measurement database, and generative AI to close that gap — interpreting free-form requests, grounding them in real brand measurements, and rendering the result visually.

## JIRA DASHBOARD LINK 
https://ananthakrishnanm010.atlassian.net/jira/software/projects/COS/boards/34/backlog?atlOrigin=eyJpIjoiNjVhNDQ2ZDRkNjBjNDI1MjgyMjI2ZmQzZmRkOWZkN2QiLCJwIjoiai

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Express (Node.js) |
| Database | PostgreSQL |
| AI — language | LLM API (prompt parsing / customization extraction) |
| AI — image | Generative image model (reference-guided garment generation) |
| Image storage | Cloudinary |
| Infrastructure | Docker Compose |

## Architecture Overview

```
React (frontend)
   │
   ▼
Express API (backend)
   ├── Brand & Size API ──────► PostgreSQL (brand/measurement data)
   ├── Reference Image Upload ─► Cloudinary
   ├── LLM Parsing Service ───► LLM API (extracts structured customization JSON)
   ├── Measurement Engine ────► deterministic calculation from brand base + requested changes
   └── Image Generation ──────► Generative image API (reference-guided)
```

**Flow:** upload reference garment → pick brand & size → describe customization in natural language → LLM extracts structured data → measurement engine calculates final dimensions → generation service produces the customized garment image → result shown to user, refinable via further prompts.

## Project Structure

```
.
├── frontend/               # React app
├── backend/                # Express API
│   ├── routes/
│   ├── services/           # LLM parsing, measurement calculation, image generation
│   ├── models/             # DB models
│   └── config/
├── docker-compose.yml
├── .env.example
└── README.md
```

*(Adjust to match your actual folder layout once scaffolded.)*

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if not running via Docker)
- API keys for the LLM provider, image-generation provider, and Cloudinary

### Setup

1. Clone the repository
   ```bash
   git clone <https://github.com/arya-arun-123/COSPLAY-AI-Intelligent-Costume-Customization-Using-LLM-CNN-and-NLP>
   cd <project-folder>
   ```

2. Copy environment variables and fill in your keys
   ```bash
   cp .env.example .env
   ```

3. Start services with Docker Compose
   ```bash
   docker compose up --build
   ```

   Or run manually:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend
   cd frontend
   npm install
   npm start
   ```

4. Run database migrations (if applicable)
   ```bash
   npm run migrate
   ```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `LLM_API_KEY` | API key for the language model used to parse customization prompts |
| `IMAGE_GEN_API_KEY` | API key for the generative image model |
| `CLOUDINARY_URL` | Cloudinary credentials for image storage |
| `PORT` | Backend server port |

## API Overview

| Endpoint | Description |
|---|---|
| `POST /api/images/upload` | Upload a reference garment image |
| `GET /api/brands` | List supported brands |
| `GET /api/brands/:brand/sizes` | Get available sizes for a brand |
| `GET /api/measurements` | Retrieve standard measurements for a brand/size |
| `POST /api/customize/parse` | Send a natural-language prompt, get structured customization data |
| `POST /api/customize/measurements` | Calculate customized measurements from base + requested changes |
| `POST /api/customize/generate` | Generate the customized garment image |


## Roadmap

- [x] Project setup — React, Express, PostgreSQL, Docker Compose
- [ ] Frontend customization flow — home, upload, brand/size selection, prompt, processing, result screens
- [ ] Backend brand & measurement management APIs
- [ ] Deterministic measurement calculation engine
- [ ] LLM-based customization parsing and validation
- [ ] AI garment generation with reference-image preservation
- [ ] End-to-end pipeline integration
- [ ] E2E testing, UI polish, and demo handoff

## Contributing

1. Create a feature branch from `main`
2. Follow the project's Git workflow (see `/docs` if available)
3. Open a PR with a clear description of changes


