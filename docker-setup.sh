#!/bin/bash

# function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "checking script deps...."

# check if git is installed
if command_exists git; then
    git_version=$(git --version | awk '{print $3}')
    echo "dep satisfied: git v$git_version"
else
    echo "error: git is not installed. please install git and try again."
    exit 1
fi

# check if docker is installed
if command_exists docker; then
    docker_version=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo "dep satisfied: docker v$docker_version"
else
    echo "error: docker is not installed. please install docker and try again."
    exit 1
fi

# check for docker compose (either 'docker-compose' or 'docker compose')
if command_exists docker-compose; then
    compose_version=$(docker-compose --version | awk '{print $4}')
    echo "dep satisfied: docker-compose v$compose_version"
    compose_command="docker-compose"
elif docker compose version >/dev/null 2>&1; then
    compose_version=$(docker compose version | head -n 1 | awk '{print $4}')
    echo "dep satisfied: docker compose plugin v$compose_version"
    compose_command="docker compose"
else
    echo "error: docker compose is not installed. please install docker compose and try again."
    exit 1
fi

# check if repository exists
if [ -d "africo-x" ]; then
    echo "repository found, updating..."
    cd africo-x || { echo "error: failed to enter directory africo-x"; exit 1; }
    
    echo "pulling latest changes..."
    git pull origin main

    echo "stopping containers and removing volumes..."
    $compose_command down -v
else
    echo "cloning repository..."
    git clone -b main https://github.com/chyna-gvng/africo-x.git

    # change to the project directory
    cd africo-x || { echo "error: failed to enter directory africo-x"; exit 1; }
fi

# build with the detected docker-compose command
echo "building with $compose_command..."
$compose_command up --build -d

# sleep for 60 seconds - to allow the containers to start
echo "finalizing..."
sleep 60

# notify user when setup is complete
echo "setup complete!"

# notify user of UI URL
echo "UI 👉 http//:localhost"

# exit the script
exit 0
