# CI/CD Pipeline for Node.js To-Do Application (DSO101 - Assignment 3)

## 🌐 Live Application

| Service | URL |
|---------|-----|
| **Frontend (Tasko App)** | https://fe-todo-02250372.onrender.com |
| **Backend API** | https://be-todo-02250372.onrender.com |
| **API Health Check** | https://be-todo-02250372.onrender.com/api/todos |

---

## 🔗 Repository

**GitHub:** https://github.com/Surash124/surashsubba_02250372_DSO101_A1-.git

---

##  Project Overview

**Tasko** is a full-stack To-Do List application built with:
- **Frontend:** Plain HTML/CSS/JS served via nginx Docker container
- **Backend:** Node.js + Express REST API
- **Database:** PostgreSQL (Render managed)

This project demonstrates a complete **CI/CD pipeline** using GitHub Actions to automatically build, containerize, and deploy the application on every push to the `main` branch.

---

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD Automation |
| Docker | Containerization |
| DockerHub | Image Registry |
| Render.com | Cloud Deployment |
| Node.js + Express | Backend Runtime |
| PostgreSQL | Database |
| nginx | Frontend Static Server |
| npm | Package Management |

---

## 📂 Project Structure

```bash
todo-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── backend/
│   ├── Dockerfile              # Backend Docker image
│   ├── server.js               # Express API server
│   ├── server.test.js          # Jest unit tests
│   ├── package.json
│   ├── .env                    # Local environment variables
│   └── .env.production         # Production environment variables
├── frontend/
│   ├── Dockerfile              # Frontend Docker image (nginx)
│   ├── index.html              # Tasko UI
│   ├── .env
│   └── .env.production
├── render.yaml                 # Render blueprint for multi-service deploy
├── Jenkinsfile                 # Jenkins pipeline (Assignment 2)
└── README.md
```

---

##  Implementation Steps

### 1. Application Development

Built a full-stack To-Do app with:
- **Frontend:** HTML/CSS/JS with a clean dark UI ("Tasko")
- **Backend:** CRUD REST API (`/api/todos`) using Express + PostgreSQL
- **Database:** PostgreSQL with auto table creation on startup

### 2. Containerization

Created separate Dockerfiles for frontend and backend:

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. GitHub Actions Workflow

Created `.github/workflows/deploy.yml` that triggers on every push to `main`:

```yaml
on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Docker Image
        run: |
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest .
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest

      - name: Trigger Render Deployment
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### 4. Secret Management

Configured GitHub Secrets to securely manage credentials:

| Secret | Purpose |
|--------|---------|
| `DOCKERHUB_USERNAME` | DockerHub login |
| `DOCKERHUB_TOKEN` | DockerHub access token |
| `RENDER_DEPLOY_HOOK` | Render webhook for auto-redeploy |

### 5. Database Setup

Used Render's managed PostgreSQL (Singapore region) with these environment variables on Render:

```
DB_HOST=<dpg-d7v32djrjlhs73af48pg-a>
DB_NAME=tododb_iqc9
DB_USER=tododb_iqc9_user
DB_PASSWORD=<ZevKq34gple8Lfc5DNy0ID9GWWfgJGxF>
DB_PORT=5432
DB_SSL=true
PORT=5000
```

### 6. Render Deployment

Deployed both services on Render.com:
- **fe-todo:02250372** — Frontend (nginx Docker image)
- **be-todo:02250372** — Backend (Node.js Docker image)
- **todo-db** — Managed PostgreSQL (Singapore region)

---

## 🧩 CI/CD Workflow Summary

```text
Developer Pushes Code to GitHub (main branch)
        ↓
GitHub Actions Triggered Automatically
        ↓
Docker Images Built (frontend + backend)
        ↓
Images Pushed to DockerHub
        ↓
Render Webhook Triggered via curl
        ↓
Render Pulls New Image & Redeploys
        ↓
Live Application Updated 
```

---

##  Errors Encountered & How They Were Fixed

### Error 1: "Could not connect to server. Make sure the backend is running."

**What happened:**
The frontend showed this error immediately after deployment even though both services showed "Deployed" on Render.

**Root Cause:**
The `API_URL` inside `index.html` was hardcoded as `http://localhost:3000` (and later `localhost:5000`). Since the frontend is a plain HTML file served by nginx — not a React app — environment variables like `REACT_APP_API_URL` set on Render have no effect. They are only useful for React apps at build time.

**Fix:**
Directly changed the hardcoded value inside `index.html`:
```javascript
// Before (wrong)
const API_URL = 'http://localhost:3000';

// After (correct)
const API_URL = 'https://be-todo-02250372.onrender.com';
```
Then rebuilt and pushed the Docker image, and manually redeployed on Render.

**Lesson learned:**
For plain HTML/nginx frontends, environment variables must be hardcoded or injected at build time. `REACT_APP_*` variables only work in React (Create React App) projects.


---

### Error 2: `{"success":false,"error":"Connection terminated unexpectedly"}`

**What happened:**
Visiting `/api/todos` on the backend returned this error even though the server itself was running.

**Root Cause:**
The Render PostgreSQL database that was created during Assignment 1 had **expired** (Render free tier databases expire after 90 days). The `DB_HOST` in the environment variables was pointing to a database instance that no longer existed. Additionally, even though the hostname contained "singapore", the `DB_URL` was pointing to an Oregon region database — a region mismatch from mixing up credentials.

**Fix:**
1. Created a new Render PostgreSQL database in the **Singapore** region (same region as the web services)
2. Updated all DB environment variables in the be-todo service with the new credentials
3. Added `DB_SSL=true` environment variable since Render PostgreSQL requires SSL connections

**Lesson learned:**
Render free PostgreSQL instances expire after 90 days. Always check that your database still exists if you get connection errors. Also, ensure all services (frontend, backend, database) are in the **same region** to avoid latency and connection issues.

---

### Error 3: SSL Connection Refused

**What happened:**
Even after creating a new database and updating credentials, the connection still failed.

**Root Cause:**
The backend `server.js` had this SSL configuration:
```javascript
ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
```
The `DB_SSL` environment variable was not set on Render, so SSL was disabled. But Render PostgreSQL **requires** SSL connections.

**Fix:**
Added `DB_SSL=true` to the be-todo environment variables on Render and redeployed.

**Lesson learned:**
Always enable SSL when connecting to cloud-managed PostgreSQL databases. Render, Railway, Supabase and most cloud providers require SSL. The `rejectUnauthorized: false` flag is needed because Render uses self-signed certificates.

---

### Error 4: REACT_APP_API_URL Not Working

**What happened:**
Set `REACT_APP_API_URL=https://be-todo-02250372.onrender.com` on Render's environment tab for the fe-todo service, but the frontend still called `localhost`.

**Root Cause:**
The frontend is **not a React app** — it's a static HTML file served by nginx. Setting `REACT_APP_*` variables on Render has absolutely no effect on a pre-built Docker image. The API URL was hardcoded in the JavaScript inside `index.html`.

**Fix:**
Updated the `API_URL` constant directly in `index.html`, rebuilt the Docker image locally, pushed to DockerHub, and manually redeployed on Render.

**Lesson learned:**
Environment variables set on a hosting platform only work if the application is designed to read them at **runtime**. For static files (HTML/JS), the values must be embedded at **build time**. This is an important distinction in CI/CD workflows.

---

##  Learning Outcomes

Through this project and the challenges faced, I learned:

1. **CI/CD Lifecycle** — Mastered the full build → test → push → deploy pipeline using GitHub Actions
2. **Docker Containerization** — Understood how to write Dockerfiles for different types of applications (Node.js backend vs nginx static frontend)
3. **Environment Variables vs Hardcoded Values** — Learned the critical difference between runtime env vars and build-time values, especially for static frontends
4. **Cloud Database Management** — Gained experience with managed PostgreSQL on Render including SSL requirements, region selection, and credential management
5. **Debugging Deployment Issues** — Learned to use browser DevTools (F12 Console) to identify exactly what URL the frontend was calling, which was essential for diagnosing connection errors
6. **Secret Management** — Understood why credentials must never be hardcoded and how to use GitHub Secrets and Render environment variables securely
7. **Multi-Service Architecture** — Understood how frontend, backend, and database services communicate in a cloud deployment and the importance of having all services in the same region

---

##  Screenshots

| Description | Screenshot |
|-------------|------------|
| GitHub Actions Success | ![GitHub Actions](screenshots/GithubAction.png) |
| DockerHub Repository | ![DockerHub](screenshots/dockerhub-images.png) |
| Render Deployment | ![Render](screenshots/render-deployed.png) |
| Live Frontend (Tasko) | ![Frontend](screenshots/fetodorender.png) |
| Backend API Response | ![Backend](screenshots/betodorender.png) |

---

## ✅ Submission Checklist

- [x] GitHub repository is public
- [x] `package.json` contains `test` and `start` scripts
- [x] Docker images tagged with student ID `02250372`
- [x] GitHub Secrets configured (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK`)
- [x] Render deployment webhook is working
- [x] Screenshots attached
- [x] Live deployment URL added
- [x] Frontend successfully connects to backend
- [x] Backend successfully connects to PostgreSQL database
- [x] CRUD operations working (Create, Read, Update, Delete todos)

---

## 📄 License

This project is created for educational purposes as part of DSO101 - Continuous Integration and Continuous Deployment at the College of Science and Technology, Royal University of Bhutan.
