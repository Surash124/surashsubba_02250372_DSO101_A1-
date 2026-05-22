# DSO101 – Lab 5: Pushing Image to Docker Hub


### Aim

To build a Docker image locally, push it to Docker Hub, and make it accessible from anywhere.



### Theory

Docker Hub is a cloud registry where Docker images are stored and shared — like GitHub but for Docker images. Without pushing, an image only exists on your computer and no one else can use it. After pushing, any server or CI/CD pipeline anywhere can pull and run it automatically.



## Commands Used

```bash
# see all images stored on your local machine
docker images

# build image and tag it with your Docker Hub username
# username tells Docker which account to push to — without it Docker doesn't know where to send it
docker build -t username/imagename .

# log into Docker Hub from terminal — enter username and password when prompted
# must do this before pushing
docker login

# upload the image to Docker Hub
# :latest is the default tag (version label) — you can also use :v1, :v2 etc.
docker push username/imagename:latest

# download the image back to verify it was pushed successfully
# anyone anywhere can run this command to get your image
docker pull username/imagename:latest
```



## Dockerfile Structure

### Python/Flask App

```dockerfile
FROM python:3.10-slim    # base image to build on top of
WORKDIR /app             # working directory inside the container
COPY . .                 # copy all files from your machine into the container
RUN pip install flask    # install dependencies during build
EXPOSE 8080              # document which port the app uses
CMD ["python", "app.py"] # command that runs when container starts
```

### Node.js App

```dockerfile
FROM node:18             # same structure, different base image
WORKDIR /app
COPY . .
RUN npm install          # install node dependencies
EXPOSE 8080
CMD ["node", "server.js"]
```


## Flow

```
Developer writes code
        ↓
docker build → image created locally
        ↓
docker push → image uploaded to Docker Hub    ← Lab 5
        ↓
Jenkins pulls image from Docker Hub           ← Lab 3
        ↓
Deploys to production automatically
```



## Reflection

1. Without pushing, an image is stuck on your machine — pushing to Docker Hub makes it available to any server, teammate, or CI/CD pipeline anywhere in the world.
2. Key learning was that the image must be tagged as `username/imagename` before pushing — without the username, Docker doesn't know which account to send it to.
3. `:latest` is automatically added if you don't specify a tag — but using version tags like `:v1`, `:v2` is better practice for tracking changes.
4. Successfully built, pushed, and pulled back the image — confirming it was live on Docker Hub.