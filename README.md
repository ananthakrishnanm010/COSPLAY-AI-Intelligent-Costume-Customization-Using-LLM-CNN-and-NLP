# COSPLAY AI: Intelligent Costume Customization  
## ABSTRACT  
The proposed AI-Powered Brand-Aware Clothing Customization System is a Generative AI-based platform that enables users to create personalized clothing designs using natural-language prompts while maintaining the standard sizing specifications of selected clothing brands. Unlike conventional fashion platforms that provide fixed designs and limited customization options, the proposed system allows users to describe their desired garment features, including clothing type, color, embroidery, size, and specific measurement modifications. Natural Language Processing is used to understand and extract the user's requirements from the prompt, while a structured database stores brand-specific standard size measurements. Based on the selected brand and size, the system retrieves the relevant measurements and calculates customized dimensions according to the user's instructions. The processed design requirements and calculated measurements are then provided to a Generative AI model to create a visual representation of the customized garment. The system can also support iterative customization, allowing users to refine their designs through additional naturallanguage instructions. By combining Natural Language Processing, Generative AI, database-driven measurement calculation, and web technologies, the proposed system provides an intuitive, flexible, and personalized approach to digital clothing customization.  
## PROBLEM STATEMENT
Existing online fashion platforms mainly provide customers with predefined clothing designs  and fixed size options, offering limited flexibility for personalized customization. Users who  want to modify specific aspects of a garment, such as color, embroidery, sleeve length, shirt length, or other dimensions, often have to depend on manual measurements or limited customization forms. Additionally, standard sizes can vary between different clothing brands, making it difficult for users to customize a garment while maintaining the sizing standards of a particular brand. Conventional systems also lack the ability to understand complex clothing requirements expressed naturally by users. Therefore, there is a need for an intelligent system that can understand natural-language customization requests, identify the selected brand and size, retrieve the corresponding standard measurements, and calculate the required modifications accurately. The proposed AI-Powered Brand-Aware Clothing Customization System addresses this problem by combining Natural Language Processing, a brand-specific measurement database, and Generative AI. The system interprets user prompts, applies the requested dimensional and visual changes based on the selected brand's standard size, and generates a visual representation of the customized garment. This provides users with a more intuitive, flexible, and personalized approach to clothing design and customization.  
## JIRA DASHBOARD LINK 
https://ananthakrishnanm010.atlassian.net/jira/software/projects/COS/boards/34/backlog?atlOrigin=eyJpIjoiNjVhNDQ2ZDRkNjBjNDI1MjgyMjI2ZmQzZmRkOWZkN2QiLCJwIjoiai

## Tech Stack

### Frontend (Client)

- **Framework:** React.js
- **Build Tool:** Vite
- **Routing:** React Router DOM (v6+)
- **Styling:** Vanilla CSS Modules
- **State & Sync:** Context API (global state) & standard fetching services

### Backend (Server)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)

### Infrastructure & Services

- **Database:** PostgreSQL (Neon Serverless PostgreSQL)
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render

---

## Workspace Structure Overview

This repository uses npm Workspaces to manage the frontend client and backend server code in one single project root.

```text
thread-and-form/
├── client/          # Vite + React frontend application
├── server/          # Node.js + Express backend application
├── shared/          # Shared constants, types, and logic definitions
├── docs/            # Technical documentation guides
└── .github/         # Automated actions (CI/CD) workflows
```

---

## Installation & Setup

To run this project locally, ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Clone & Install Dependencies

Run this at the root directory to install dependencies for all workspaces at once:

```bash
npm install
```

### 2. Configure Environment Variables

Copy the template `.env.example` file to `.env` in the root:

```bash
cp .env.example .env
```

Open the `.env` file and enter your PostgreSQL database URL, JWT secret key, and optional payment key values.

### 3. Run Database Migrations

Initialize your database and run outstanding schema migrations using Prisma:

```bash
npm run db:migrate
```

### 4. Seed the Database

Populate database categories and items with initial seed mock data:

```bash
npm run db:seed
```

### 5. Start Development Servers

Run the client and server concurrently in development mode:

```bash
npm run dev
```

- Frontend starts at: `http://localhost:5173`
- Backend starts at: `http://localhost:5000`

---

## Development Workflow

1. **Clean Code Formatting:** Code style rules are enforced with ESLint and Prettier. To auto-format your code, run:
   ```bash
   npm run format
   ```
2. **Feature Isolation:** When building out a new feature, place feature-specific UI, hooks, and services under a separate subfolder inside `client/src/features/<feature-name>`.
3. **Database Schema Modifications:** When modifying DB schemas, update `server/prisma/schema.prisma` and create a migration using:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```

---

## Future Feature Roadmap

- **Phase 1: Foundation & Authentication** - User signup, secure JWT auth, session management.
- **Phase 2: Product Catalog** - Categories, products, search, inventory counting, image uploads.
- **Phase 3: Customer Experience** - Cart, wishlist, review ratings, coupon applications.
- **Phase 4: Checkout & Payments** - Order management, Stripe API checkout integration.
- **Phase 5: Administration** - Metrics dashboard, inventory adjustments, user role permissions.

---

## Documentation

For deep dives into the project design, please check out the files inside the [docs/](file:///d:/COSPLAY.COM/docs/) folder:

- [Architecture Guide](file:///d:/COSPLAY.COM/docs/Architecture.md)
- [Folder Structure Explanation](file:///d:/COSPLAY.COM/docs/FolderStructure.md)
- [API Design Specification](file:///d:/COSPLAY.COM/docs/API.md)
- [Database Schema & Seed Guidelines](file:///d:/COSPLAY.COM/docs/Database.md)
- [Deployment Walkthroughs](file:///d:/COSPLAY.COM/docs/Deployment.md)
