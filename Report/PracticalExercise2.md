# DSO101 – Docker Lab: Basic Commands



### Aim

To build, tag, and optimize Docker images using a Dockerfile, and run containers with port mapping through hands-on practice using the KodeKloud interactive lab environment.



## Docker Lab

### Lab: Docker Images

Answers:

1. 9
2. 7.81 MB
3. 1.14 - alpine
4. python:3.6
5. /opt
6. python app.py
7. 8080

8. 

![KodeKloud1](/screenshots/8.png)

9. `docker run -p 8282:8080 webapp-color`

10. -

11. -

![KodeKloud1](/screenshots/l2_11.png)

12. 920 MB

13.

![KodeKloud1](/screenshots/l2_13.png)

14.
![KodeKloud1](/screenshots/l2_14.png)

15.
![KodeKloud1](/screenshots/l2_15.png)

End 

![KodeKloud1](/screenshots/l2_16.png)


## Reflection
1. docker build -t name . builds an image from a Dockerfile in the current directory.
2. The base image in FROM directly affects the final image size — python:3.6 produced a 913MB image while python:3.6-alpine brought it down to just 50.9MB.
3. Tagging images with docker build -t webapp-color:lite . helps version and identify different builds of the same app.
4. EXPOSE in a Dockerfile documents the port but does not publish it — port mapping must be done at runtime with -p.
5. docker run -d -p 8383:8080 webapp-color:lite runs the container in the background and maps container port 8080 to host port 8383.
6. using a lightweight base image like Alpine is a best practice to keep images small and faster to deploy.