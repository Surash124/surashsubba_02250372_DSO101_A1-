
#  Tech Notes
Tech
- Render
- GitHub Actions
- Vercel

lesson
- Dockerfile
- Docker Compose

##  Render

### What is it?
Render is a cloud hosting platform where you can deploy web apps, APIs, databases, and static sites — all from one place.

### How does it work?
You connect your GitHub repo to Render. Every time you push code, Render automatically builds and deploys your app. You can also set environment variables, custom domains, and auto-scaling from its dashboard.

### Where is it used?
- Deploying Node.js / Python / any backend server
- Hosting static websites
- Running background workers or cron jobs
- Free-tier hosting for small projects



##  GitHub Actions

### What is it?
GitHub Actions is a CI/CD (Continuous Integration / Continuous Deployment) tool built directly into GitHub. It lets you automate tasks like testing, building, and deploying code.

### How does it work?
You write a YAML file inside `.github/workflows/` in your repo. This file defines **triggers** (e.g., on every push or pull request) and **steps** (e.g., install dependencies → run tests → deploy). GitHub runs these steps automatically on their servers.

### Where is it used?
- Running tests automatically when code is pushed
- Auto-deploying to Render, Vercel, or any server
- Sending notifications or creating releases
- Any repetitive dev task you want automated



##  Vercel

### What is it?
Vercel is a hosting platform specifically designed for frontend frameworks like Next.js, React, and Vue. It's made by the same team that built Next.js.

### How does it work?
You connect your GitHub repo to Vercel. On every push, it builds your frontend and gives it a live URL. It also gives you **preview deployments** — every pull request gets its own unique link to preview changes before merging.

### Where is it used?
- Deploying Next.js / React / Vue frontends
- Getting instant preview links for every branch
- Serverless API routes (via Next.js API routes)
- Production-grade frontend hosting with CDN

---

  **How they work together:**
  
   You write code → push to GitHub → GitHub Actions runs tests → if passed, Vercel or Render deploys automatically.



##  Dockerfile
 
### What is it?
A Dockerfile is a plain text file with instructions to build a **Docker image** — a package that contains your app and everything it needs to run (OS, dependencies, code).
 
### How does it work?
You write a `Dockerfile` in your project root. Each line is a step — like choosing a base image, copying your files, installing dependencies, and setting the start command. Then you run `docker build` to create the image and `docker run` to start a container from it.
 
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```
 
### Where is it used?
- Packaging your app so it runs the same on any machine
- Deploying apps to cloud services (Render, AWS, etc.)
- Avoiding the "works on my machine" problem
- Creating isolated environments for every project
---
 
##  Docker Compose
 
### What is it?
Docker Compose is a tool that lets you define and run **multiple containers together** using a single `docker-compose.yml` file. Instead of running each container manually, you start everything with one command.
 
### How does it work?
You write a `docker-compose.yml` file that lists all your services (e.g., app, database, cache). Each service has its own image, ports, environment variables, and volumes. Then you run `docker compose up` and all containers start together.
 
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: secret
```
 
### Where is it used?
- Running a backend + database together locally
- Setting up full dev environments with one command
- Connecting multiple services (e.g., Node app + PostgreSQL + Redis)
- Replacing long `docker run` commands with a clean config file
---
 

 
  **Docker tip:**
  
   `Dockerfile` builds a single image for your app. `Docker Compose` runs your app image together with other services like a database — all at once.