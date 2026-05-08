# DSO101 Assignment 2 – Jenkins CI/CD Pipeline

**Name:** Surash Subba | **ID:** 02250372

Setting up a Jenkins pipeline to automate build, test, and deployment of the to-do app from Assignment 1.

---

## Tools Used
- Jenkins (localhost:8080)
- Node.js + Jest + Supertest
- Docker + Docker Hub
- GitHub

---

## Pipeline Stages

| Stage | What it does |
|---|---|
| Checkout | Pulls code from GitHub |
| Install | Runs `npm install` in backend |
| Test | Runs Jest unit tests |
| Deploy | Builds and pushes Docker image to Docker Hub |

---

## Step 1 – Jenkins Setup

Installed Jenkins and configured the following plugins:
- NodeJS Plugin
- Pipeline
- Docker Pipeline
- GitHub Integration
- Config File Provider (required by NodeJS plugin)

Configured NodeJS 20.19.1 under **Manage Jenkins → Tools → NodeJS installations**.

![Jenkins plugins](./screenshots/jenkins-plugins.png)

---

## Step 2 – GitHub Credentials

Generated a GitHub Personal Access Token (PAT) with `repo` and `admin:repo_hook` permissions and added it to Jenkins as `github-creds`.

---

## Step 3 – Jest Tests

Created `server.test.js` with 5 tests covering the main API routes:
- `GET /` — API running check
- `GET /api/todos` — fetch all todos
- `POST /api/todos` — create todo
- `POST /api/todos` — fail if title missing
- `DELETE /api/todos/:id` — 404 if not found

Used `supertest` to simulate HTTP requests and mocked `pg` Pool so no real database is needed during testing.

Ran locally first to confirm all tests pass:

![Local tests passing](./screenshots/local-tests-pass.png)

---

## Step 4 – Jenkinsfile

Created `Jenkinsfile` at the repo root with 4 stages. Full pipeline:

```groovy
pipeline {
  agent any
  tools {
    nodejs 'NodeJS'
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            credentialsId: 'github-creds',
            url: 'https://github.com/Surash124/surashsubba_02250372_DSO101_A1-.git'
      }
    }
    stage('Install') {
      steps {
        dir('todo-app/backend') {
          bat 'npm install'
        }
      }
    }
    stage('Test') {
      steps {
        dir('todo-app/backend') {
          bat 'npm test'
        }
      }
      post {
        always {
          junit 'todo-app/backend/junit.xml'
        }
      }
    }
    stage('Deploy') {
      steps {
        script {
          docker.build('surashsubba/be-todo:latest', 'todo-app/backend')
          docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
            docker.image('surashsubba/be-todo:latest').push()
          }
        }
      }
    }
  }
}
```

---

## Step 5 – Pipeline Configuration in Jenkins

1. Created a new Pipeline job called `todo-pipeline`
2. Set **Definition** to `Pipeline script from SCM`
3. Set **SCM** to Git with the GitHub repo URL
4. Set **Script Path** to `Jenkinsfile`

---

## Issues I ran into

- **NodeJS plugin failed to install** — missing `Config File Provider` dependency. Fixed by installing it separately first.

  ![Plugin install failure](./screenshots/.png)

- **`sh` command not found** — Jenkinsfile used `sh` which is Linux-only. Jenkins was running on Windows so had to change all `sh` to `bat`.

  ![sh error](./screenshots/sh-error.png)

- **Wrong GitHub repo URL in Jenkinsfile** — used `surashsubba` instead of `Surash124` as the username. Fixed the URL and pushed again.

- **Docker build failed** — Dockerfile path was wrong, it was looking in repo root instead of `todo-app/backend`. Fixed by passing the path: `docker.build('...', 'todo-app/backend')`.

  ![Docker path error](./screenshots/docker-path-error.png)

- **Docker push unauthorized** — used Docker Hub account password which didn't work. Had to generate a Docker Hub Access Token and use that instead.

  ![Docker push error](./screenshots/docker-push-error.png)

---

## Final Result

All 4 stages passed successfully:

![Pipeline success](./screenshots/pipeline-success.png)
![Test results](./screenshots/test-results.png)
![Docker Hub image](./screenshots/dockerhub-latest.png)
