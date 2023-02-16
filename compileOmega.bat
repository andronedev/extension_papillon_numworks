@echo off

REM Build the Docker image
docker build -t omega-web ./omega-docker

REM Run the Docker container and bind port 8000
docker run -d -p 8000:8000 --name omega-container omega-web

REM Wait for the container to start
timeout /t 5

REM Download the zip file
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:8000/omega-web.zip' -OutFile 'omega-web.zip'"

REM Extract the contents of the zip file to the Omega directory
powershell -Command "Expand-Archive -Path 'omega-web.zip' -DestinationPath '.\omega-build' -Force"

REM Stop and remove the Docker container
docker stop omega-container
