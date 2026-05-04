# DSO101 Assignment 1

**Name:** Surash Subba | **ID:** 02250372

A simple full-stack To-Do app deployed using Docker and Render.com.

---

## Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: PostgreSQL

---

## Part A – Docker Hub + Render (Manual)

Built and pushed images to Docker Hub:

```bash
docker build -t surashsubba/be-todo:02250372 ./backend
docker push surashsubba/be-todo:02250372

docker build -t surashsubba/fe-todo:02250372 ./frontend
docker push surashsubba/fe-todo:02250372
```

Then deployed both as Web Services on Render using the Docker Hub images.

![Render deployed](./screenshots/render-deployed.png)
![Docker Hub](./screenshots/dockerhub-images.png)

---

## Part B – Auto Deploy from Git

Added a `render.yaml` file so Render rebuilds and redeploys automatically on every git push.

```yaml
services:
  - type: web
    name: be-todo
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: PORT
        value: 5000
      - key: DB_HOST
        value: your-render-db-host

  - type: web
    name: fe-todo
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: REACT_APP_API_URL
        value: https://be-todo.onrender.com
```

---

## Issues I ran into

- Forgot to add `.env` to `.gitignore` at first — pushed credentials by accident, had to remove it

- Frontend was calling the wrong API URL — changed `API_URL` to wrong port, backend connection failed

  ![Wrong API URL](./screenshots/wrong-api-url.png)

- CORS errors when FE and BE were on different origins — fixed by adding cors middleware to the backend

  ![CORS Error](./screenshots/cors-error.png)

- Port mismatch between Dockerfile (`EXPOSE 5000`) and what Render was expecting — fixed by setting `PORT` env var explicitly

- Initially left the region as default (Oregon) — switched to Singapore since it's geographically closer

---

## Folder Structure

```
/todo-app
  /frontend
    Dockerfile
  /backend
    Dockerfile
  render.yaml
```