# DSO101 – Lab 4: Building a Docker Image for an Application



### Aim

To create a Dockerfile for a Python Flask application, build a Docker image from it, and run it as a container.



### Theory

A Dockerfile is a plain text script with step-by-step instructions that Docker reads to build an image. Each instruction adds a layer to the image. Images are immutable — once built they don't change. You run them as containers.



## Dockerfile Instructions

- `FROM` — Base image to build on top of (must be first)
- `WORKDIR` — Set working directory inside container
- `COPY` — Copy files from your machine into the image
- `RUN` — Run a command during build (e.g. install packages)
- `EXPOSE` — Document which port the app uses
- `CMD` — Command that runs when container starts



## The Flask App (app.py)

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Docker!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```


## The Dockerfile

```dockerfile
FROM python:3.9          # base image — Python 3.9 pre-installed
WORKDIR /app             # all commands run from here inside container
COPY . .                 # copy everything from your folder into /app
RUN pip install flask    # install flask during build
EXPOSE 5000              # document that app runs on port 5000
CMD ["python", "app.py"] # runs when container starts
```



## Commands Used

```bash
# build image from Dockerfile in current folder (.)
# -t flaskapp gives the image a name
# without the . Docker doesn't know where to find the Dockerfile
docker build -t flaskapp .

# verify the image was created successfully
docker images

# run the container, map your port 8080 → container's port 5000
# open localhost:8080 in browser to see the app
docker run -p 8080:5000 flaskapp

# confirm container is running
docker ps

# stop the container
docker stop <container_id>
```



## Reflection

1.  A Dockerfile is like a recipe — Docker reads it top to bottom and builds the image step by step, each instruction adding a layer.
2. Key learning was the difference between `RUN` and `CMD` — `RUN` executes during build (e.g. installing flask), `CMD` executes when the container actually starts.
3. Port mapping `-p 8080:5000` is needed because Flask runs on port 5000 inside the container — without it the app is sealed off and unreachable from the browser.
4. Successfully built the image, ran the container, and saw "Hello from Docker!" in the browser at localhost:8080.