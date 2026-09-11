# Deployment Guide - Thread & Form

This document provides step-by-step instructions for deploying Thread & Form to production.

---

## Deployment Target Overview

| Component    | Target Platform | Link / Service                        |
| :----------- | :-------------- | :------------------------------------ |
| **Frontend** | Vercel          | Static hosting (built with Vite)      |
| **Backend**  | Render          | Web Service hosting (Node.js runtime) |
| **Database** | Neon            | Serverless PostgreSQL                 |

---

## 1. Database Setup (Neon)

1. Sign up/log in to [Neon Console](https://neon.tech/).
2. Create a new project called `thread-and-form`.
3. Copy the connection string under **Connection Details** (make sure SSL is enabled).
4. Save this string for the backend configuration (`DATABASE_URL`).

---

## 2. Backend Deployment (Render)

1. Log in to [Render Dashboard](https://render.com/).
2. Create a new **Web Service** and link it to your GitHub Repository.
3. Configure the following build settings:
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`
4. Go to **Environment** and add variables:
   - `DATABASE_URL` = _(Your Neon database connection string)_
   - `JWT_SECRET` = _(A long, secure random passphrase)_
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave default, Render sets this automatically)
5. Deploy. Render will generate an API endpoint (e.g., `https://thread-and-form-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Log in to [Vercel Console](https://vercel.com/).
2. Click **Add New** > **Project** and select your GitHub Repository.
3. Configure the following project parameters:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_URL` = `https://thread-and-form-api.onrender.com/api/v1` _(The API endpoint provided by Render)_
5. Click **Deploy**. Vercel will build and serve your static React bundle.

---

## 4. Production Verifications

After deploying both layers, perform the following validation tests:

1. Verify the frontend loads at its Vercel URL.
2. Confirm the frontend can successfully ping the backend endpoint by checking browser network headers.
3. Sign up an account or query product listings to ensure database connections execute correctly.
