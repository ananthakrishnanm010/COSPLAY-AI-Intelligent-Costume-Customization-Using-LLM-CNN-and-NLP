# AI-Powered Brand-Aware Clothing Customization System

A generative AI platform that lets users design personalized clothing using natural-language prompts, while keeping garments true to a selected brand's standard sizing.

## Abstract

Existing fashion platforms mostly offer predefined designs and fixed sizes, leaving little room for personalization. This project lets users describe the garment changes they want (type, color, style, artwork, specific measurements) in plain language. The system:

1. Parses the prompt with NLP/LLM to extract structured customization data.
2. Looks up the selected brand's standard measurements from a database.
3. Calculates the customized dimensions deterministically, based on the brand's base sizing and the user's requested changes.
4. Feeds the design requirements and calculated measurements to a generative AI image model to produce a visual of the customized garment, based on a reference image.
5. Supports iterative refinement, so users can keep adjusting the design with follow-up prompts.

## Problem Statement

Standard sizes vary between brands, and most platforms can't reconcile a user's natural-language customization request with a specific brand's sizing standard. Customers are stuck choosing between rigid presets or manual, error-prone measurement entry. This system combines NLP, a brand-specific measurement database, and generative AI to close that gap: interpreting free-form requests, grounding them in real brand measurements, and rendering the result visually.

## JIRA DASHBOARD LINK

https://ananthakrishnanm010.atlassian.net/jira/software/projects/COS/boards/34/backlog

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Express (Node.js 20), JWT authentication, Multer uploads |
| AI backend | Express service (scaffold, port 8000 — not yet wired into the customization flow) |
| Database | PostgreSQL with Prisma ORM |
| AI — language | LLM-based prompt parsing (validation layer in place; parser call planned) |
| AI — image | Reference-guided garment image generation via Gemini (`gemini-3.1-flash-image`), with a pluggable Cloudflare Workers AI (FLUX.2 klein) provider |
| Infrastructure | Docker Compose |

## Architecture Overview

```
React client (:5173)
   │
   ▼
Express API server (:5000)
   ├── Auth, Products, Cart, Orders ──► PostgreSQL
   ├── Brand & Size API ──────────────► PostgreSQL (brand/measurement data)
   ├── Reference Image Upload ────────► local disk (uploads/reference-images)
   ├── Custom Design API ─────────────► measurement calculation + PostgreSQL
   └── AI Generation API ─────────────► generateDesignImage()
                                          ├── geminiService (default, Gemini image model)
                                          └── cloudflareService (Workers AI, FLUX.2 klein)

Standalone AI backend (:8000) ────────► scaffold only (health check), not yet in the request path
```

**Flow:** pick garment type → pick brand & size → adjust measurements → describe the design and attach a reference image → design and calculated alterations are saved → the API server calls the configured image provider (Gemini by default) to generate the customized garment image, using the reference image and prompt → result shown to user, refinable via further prompts. LLM-based parsing of the free-form prompt into structured fields (color, fit, style, design) is validated end-to-end but the parser call itself is still planned; today the raw prompt is sent straight to image generation.

## Project Structure

```
.
├── docker-compose.yml
├── LICENSE
├── back-end/                # standalone AI backend scaffold (unused by the app today)
│   └── app/                 # app.js, server.js
└── front-end/
    ├── client/              # React + Vite app
    │   └── src/             # pages, components, features, contexts, services
    ├── server/              # Express API
    │   ├── prisma/          # schema, migrations, brand seed
    │   ├── data/            # brand_size_charts.csv
    │   └── src/             # routes, controllers, services, validators, repositories, middleware
    │       ├── routes/aiGenerationRoutes.js       # POST /api/v1/generate-design
    │       ├── services/imageService.js           # picks image provider from IMAGE_PROVIDER
    │       ├── services/geminiService.js           # Gemini image generation (default)
    │       ├── services/cloudflareService.js       # Cloudflare Workers AI image generation
    │       └── validators/customizationValidation.js  # prompt + parsed-LLM-output validation
    └── shared/              # constants shared by client and server
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- PostgreSQL (if not running via Docker)
- An image-generation provider credential: a Gemini API key (default), or a Cloudflare account ID + API token if using the Cloudflare provider

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/arya-arun-123/COSPLAY-AI-Intelligent-Costume-Customization-Using-LLM-CNN-and-NLP.git
   cd COSPLAY-AI-Intelligent-Costume-Customization-Using-LLM-CNN-and-NLP
   ```

2. Set environment variables. Copy the example file and fill in your values:
   ```bash
   cd front-end
   cp .env.example .env
   echo 'VITE_API_URL=http://localhost:5000/api/v1' > client/.env
   cd ..
   ```
   Add your image-generation credentials to `front-end/server/.env` (`GEMINI_API_KEY` by default, or the `CLOUDFLARE_*` variables if you set `IMAGE_PROVIDER=cloudflare`).
   When using Docker, `.env` files are excluded from builds, so add `JWT_SECRET` (and any AI provider keys you need) to the `server` service in `docker-compose.yml` instead (and change the default database password).

3. Start services with Docker Compose
   ```bash
   docker compose up --build
   ```

   Or run manually:
   ```bash
   cd front-end
   npm install
   npm run dev          # starts client and server together
   ```

4. Run database migrations and seed brand data
   ```bash
   # Docker
   docker compose exec server npx prisma migrate deploy
   docker compose exec server node prisma/seed.cjs

   # Manual
   cd front-end/server
   npx prisma generate
   npx prisma migrate deploy
   node prisma/seed.cjs
   ```
   `npm run db:seed` adds demo users and products but deletes existing users, products, carts, and orders first.

The client runs at http://localhost:5173, the API at http://localhost:5000, and the (currently unused) standalone AI backend scaffold at http://localhost:8000.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign auth tokens (required) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API server port (default `5000`) |
| `CLIENT_URL` | Allowed CORS origin (default `http://localhost:5173`) |
| `VITE_API_URL` | API base URL used by the client |
| `IMAGE_PROVIDER` | Image generation backend: `gemini` (default) or `cloudflare` |
| `GEMINI_API_KEY` | Required when `IMAGE_PROVIDER=gemini` |
| `CLOUDFLARE_ACCOUNT_ID` | Required when `IMAGE_PROVIDER=cloudflare` |
| `CLOUDFLARE_API_TOKEN` | Required when `IMAGE_PROVIDER=cloudflare`; needs Workers AI permission |
| `CLOUDFLARE_IMAGE_SIZE` | Optional, default `1024`; `512` uses far fewer free Neurons |

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Endpoint | Description |
|---|---|
| `POST /auth/register`, `POST /auth/login` | Create an account / log in |
| `GET /auth/me` | Get the current user |
| `GET /brands` | List supported brands |
| `GET /brands/:brandId/sizes` | Get available sizes for a brand |
| `GET /brands/:brandId/:garmentType/sizes` | Get sizes for a brand and garment type |
| `GET /sizes/:sizeId/measurements` | Retrieve standard measurements for a size |
| `POST /reference-images` | Upload a reference garment image |
| `POST /custom-designs` | Save a design and calculate measurement alterations |
| `POST /generate-design` | Generate a customized garment image from a prompt, garment type, and (optional) reference image |
| `/products`, `/cart`, `/orders` | Storefront endpoints |

## Roadmap

- [x] Project setup — React, Express, PostgreSQL, Docker Compose
- [x] Frontend customization flow — garment, brand/size selection, fit, design, review screens
- [x] Backend brand & measurement management APIs
- [x] Deterministic measurement calculation
- [x] AI garment generation with reference-image preservation (Gemini, with a Cloudflare Workers AI fallback provider)
- [ ] LLM-based customization prompt parsing (structured-output validation is in place; parser call still to be wired in)
- [ ] End-to-end pipeline integration
- [ ] E2E testing, UI polish, and demo handoff

## Contributing

1. Create a feature branch from `main`
2. Run `npm run lint` and `npm run format` in `front-end/` before committing
3. Open a PR with a clear description of changes

## License

Distributed under the MIT License. See [LICENSE](LICENSE).
