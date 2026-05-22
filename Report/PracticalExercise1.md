# DSO101 – Docker Lab: Basic Commands

**Name:** Surash Subbag | **Student No:** 02250372 | **Branch:** B.E. (SWE)



### Aim

To perform basic Docker operations such as running, managing, and removing containers and images through hands-on practice using the KodeKloud interactive lab environment.


### Key Terms
- Image –   A read-only template used to create containers

- Container – A running instance of a Docker image

- Docker Hub – An online registry to pull and push Docker images

- Docker Daemon – Background service that manages containers and images

- docker run – Command to create and start a container

- docker ps – Command to list running containers

- docker images – Command to list all available images on the host

- docker stop – Command to stop a running container

- docker rm – Command to remove a container

- docker rmi – Command to remove an image

- Detached Mode (-d) – Runs a container in the background without blocking the terminal

- Container ID – A unique identifier assigned to each container



### Procedure

### 1
![KodeKloud1](/screenshots/1.png)

### 2
![KodeKloud1](/screenshots/2.png)

### 3
![KodeKloud1](/screenshots/3.png)

### 4
![KodeKloud1](/screenshots/4.png)

### 4
![KodeKloud1](/screenshots/5.png)

### 6
![KodeKloud1](/screenshots/6.png)

### 7
![KodeKloud1](/screenshots/7.png)

### 8
![KodeKloud1](/screenshots/8.png)

### 9
![KodeKloud1](/screenshots/9.png)

### 10
![KodeKloud1](/screenshots/10.png)

### 11
![KodeKloud1](/screenshots/11.png)

### 12
![KodeKloud1](/screenshots/12.png)

### 13
![KodeKloud1](/screenshots/13.png)

### 14
![KodeKloud1](/screenshots/14.png)

### 15
![KodeKloud1](/screenshots/15.png)

### 16
![KodeKloud1](/screenshots/16.png)

### 17
![KodeKloud1](/screenshots/17.png)


![KodeKloud1](/screenshots/18.png)


## Reflection
- docker ps, docker images, and docker run are the essential commands for managing containers and images.
- Trying to remove a container using the image name instead of the container ID gave an error — this clarified the difference between the two.
- Docker accepts short 3-digit IDs, and multiple containers can be removed at once  for example docker rm 2fe 9b6.
- A running container must be stopped before removal, unless -f is used.