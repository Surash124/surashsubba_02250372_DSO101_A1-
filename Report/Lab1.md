# DSO101 – Lab 1: Docker Installation and Purpose


### Aim

To understand containerization using Docker and run containers on a local system.



### Theory

Docker is a tool that packages an application and all its dependencies into a container — a lightweight, portable unit that runs the same on any machine. Unlike Virtual Machines, containers share the host OS kernel, making them faster and more resource-efficient. Docker follows a client-server model where the CLI sends commands to the Docker Daemon (dockerd), which manages everything.



### Key Terms

- Image – A template to create containers
- Container – A running instance of an image
- Dockerfile – Instructions to build an image
- Docker Hub – Online registry to store and share images



### Procedure & Commands

### 1. Check Docker Version
```bash
docker --version
```
 Checks if Docker is installed correctly.

![screenshot](/screenshots/l1.png)

### 2. Run Hello World Container
```bash
docker run hello-world
```
 Runs a test container to confirm Docker is working.


### 3. Pull Nginx Image
```bash
docker pull nginx
```
 Downloads the nginx image from Docker Hub. Nothing runs yet.



### 4. Run Nginx Container
```bash
docker run -d -p 8080:80 nginx
```
 Runs nginx in background (-d), and connects your port 8080 to container's port 80 so you can open it in browser.


### 5. List Running Containers
```bash
docker ps
```
 Shows all currently running containers.


### 6. Stop a Container
```bash
docker stop <id>
```
 Stops a running container using its ID.



### Reflection

1. Docker solves the "works on my machine" problem by bundling the app with its environment.
2. The main takeaway was that port mapping (-p 8080:80) links host to container and -d runs the container in the background so it does not lock out your terminal.
3. Successfully ran nginx container and confirmed it loaded in the browser at localhost:8080.