# DSO101 – Lab 3: Installation and Setup of Jenkins


### Aim

To install and set up Jenkins using Docker for automating CI/CD processes.


### Theory

Jenkins is an open-source automation server used for CI/CD — it watches a version control system like Git, and when code is pushed, it automatically triggers builds, tests, and deployments. Instead of installing Jenkins manually, we run it as a Docker container, keeping the environment clean and simple.

Jenkins is the automation server that watches your Git repo — when you push code, Jenkins automatically builds, tests, and deploys it. That's CI/CD in action.



## Commands Used

### Pull & Run Jenkins

```bash
# downloads and runs Jenkins (lts = stable version, recommended over latest)
docker run jenkins/jenkins:lts
```

- `jenkins/jenkins:lts` — Long Term Support, stable, recommended. This is what we used.
- `jenkins/jenkins:latest` — newest version but might have bugs, not recommended for general use.

```bash
# runs Jenkins in background (-d), connects your port 8080 to container's port 8080
# without -p, Jenkins runs inside but you can't reach it from browser at all
docker run -d -p 8080:8080 jenkins/jenkins:lts
```

- `docker run` — create and start a container
- `-d` — detached, runs in background, terminal stays free
- `-p 8080:8080` — port mapping, your machine 8080 → container 8080
- `jenkins/jenkins` — organisation/image name on Docker Hub
- `:lts` — stable long term support version

### Manage Containers

```bash
docker ps                          # see running containers
docker ps -a                       # see all containers including stopped ones
docker inspect <container_id>      # get container details like IP and port
```

### Get Admin Password

```bash
docker exec <container_id> cat /var/jenkins_home/secrets/initialAdminPassword
# goes inside the running container and reads the password file
# copy this password and paste it in browser to unlock Jenkins
```


## Flow

```
docker run -d -p 8080:8080 jenkins/jenkins:lts
        ↓
open browser → localhost:8080
        ↓
paste initial password
        ↓
Jenkins dashboard opens
        ↓
CI/CD pipeline ready
```

1. Checks locally for jenkins/jenkins:lts
        ↓
2. Not found → pulls from Docker Hub
        ↓
3. Creates container from image
        ↓
4. Jenkins starts inside container on port 8080
        ↓
5. -p maps your machine 8080 → container 8080
        ↓
6. -d sends it to background
        ↓
7. Terminal free → open localhost:8080 in browser
        ↓
8. Jenkins dashboard appears



## Reflection

1.  Jenkins solves the problem of manually building, testing, and deploying every time — it watches Git and triggers everything automatically when code is pushed.
2.  We used lts tag because it is stable and recommended — latest is newer but may have bugs.
3. Jenkins default port is 8080.
4. `docker run -p 8080:8080` is what exposes it to the browser.
5. Initial admin password is stored at `/var/jenkins_home/secrets/initialAdminPassword`.
6. Jenkins detects Git changes and auto-triggers pipelines.