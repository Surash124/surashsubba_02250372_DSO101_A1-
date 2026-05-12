# CI/CD Pipeline for Node.js To-Do Application (DSO101 - Assignment 3)

###  Live Application
URL
Frontend (Tasko App) - https://fe-todo-02250372.onrender.com

Backend API - https://be-todo-02250372.onrender.com

Todos API Endpoint- https://be-todo-02250372.onrender.com/api/todos


### Repository

GitHub: https://github.com/Surash124/surashsubba_02250372_DSO101_A1-.git

### Project overview
This assignment is the next step on Assignment 1, where everything from the deployment process up is automated using GitHub Actions. Instead of having to build and push images by hand, any push to the main branch now executes a workflow, that builds both the docker images, pushes the images to DockerHub, and also redeploys the application to Render.com via webhook.

what we did in each assignment:

A1 - Manual deployment(you build yourself and push the docker image) to Render.

A2 - Run Jenkins pipeline locally on your machine. It builds, tests and pushes to DockerHub.No redeployment on Render needed, it only automate the process of build/test/push.

A3 - automate the whole process build, push to DockerHub, and trigger Render redeploy with GitHub Actions.

###  Tech Stack

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

### Project Structure

```bash
todo-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD 
├── backend/
│   ├── Dockerfile              # Backend Docker image
│   ├── server.js               # Express API server
│   ├── server.test.js          # Jest unit tests
│   ├── package.json
│   ├── .env                    # Local environment 
│   └── .env.production         # Production environment 
├── frontend/
│   ├── Dockerfile              # Frontend Docker image (nginx)
│   ├── index.html              # Tasko UI
│   ├── .env
│   └── .env.production
├── render.yaml                 # Render blueprint for multi-service deploy
├── Jenkinsfile                 # Jenkins pipeline 
└── README.md
```



###  Implementation Steps

### 1. Application Development

Built a full-stack To-Do app with:
- Frontend: HTML/CSS/JS with a clean dark UI ("Tasko")
- Backend: CRUD REST API ( /api/todos ) using Express + PostgreSQL
- Database: PostgreSQL with auto table creation on startup

### 2. Containerization

Created separate Dockerfiles for frontend and backend:

Backend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Frontend Dockerfile:
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. GitHub Actions Workflow

Created .github/workflows/deploy.yml that triggers on every push to main:

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

![reposecrets](/screenshots/RepositorySecrets.png)

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
- fe-todo:02250372 — Frontend (nginx Docker image)
- be-todo:02250372 — Backend (Node.js Docker image)
- todo-db — Managed PostgreSQL (Singapore region)


###  CI/CD Workflow Summary

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

### Error 1: Frontend Could Not Connect to Backend
Cause: API_URL hardcoded as localhost:3000 in index.html. REACT_APP_API_URL on Render had no effect since it's plain HTML not React.

Fix: Updated API_URL directly in index.html, rebuilt Docker image and redeployed.
```javascript
// Before
const API_URL = 'http://localhost:3000';

// After
const API_URL = 'https://be-todo-02250372.onrender.com';
```


### Error 2: Database Connection Terminated
Cause: Render PostgreSQL expired (free tier = 90 days). Also region mismatch — `DB_HOST` was Singapore but `DB_URL` pointed to Oregon.

Fix: Created new PostgreSQL in Singapore, updated all DB environment variables.

![db connection terminated](/screenshots/db%20connection%20terminated.png)
### Error 3: SSL Connection Refused
**Cause:** DB_SSL not set on Render so SSL was disabled, but Render PostgreSQL requires SSL.

Fix: Added DB_SSL=true to be-todo environment variables on Render.

###  Learning Outcomes

Through this project and the challenges faced, I learned:

1. CI/CD Lifecycle: Mastered the full build → test → push → deploy pipeline using GitHub Actions
2. Docker Containerisation-Learned how to write Dockerfiles for different kinds of applications (Node.js backend vs nginx static front end).
3. Learned that for plain HTML frontends, API URLs must be hardcoded directly in the file — not set as environment variables on Render
4. Gained experience with managed PostgreSQL on Render including SSL and region selection
5. Learned to use browser DevTools (F12 Console) to debug what URL the frontend was calling
6. Understood why credentials must never be hardcoded — used GitHub Secrets instead
7. Learned how frontend, backend, and database communicate in a cloud deployment
---

###  Screenshots


| GitHub Actions Success
![GitHub Actions](screenshots/GithubAction.png)

| DockerHub Repository | ![DockerHub](/screenshots/dockerhubimages.png)

| Render Deployment
![Render](/screenshots/rendereddeployed.png)

| Live Frontend (Tasko)
![Frontend](/screenshots/live.png)

| Backend API Response
![Backend](/screenshots/backendapiresponse.png)



### License

This project is created for educational purposes as part of DSO101 a3
