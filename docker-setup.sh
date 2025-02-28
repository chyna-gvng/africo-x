#!/bin/bash

# clone repo
echo "cloning repository..."
git clone -b main https://github.com/chyna-gvng/africo-x.git

# cd into the project directory
cd africo-x

# build with docker-compose
echo "building with docker-compose..."
docker-compose up --build -d

# sleep for 60 seconds - to allow the containers to start
echo "finalizing..."
sleep 60

# notify user when setup is complete
echo "setup complete!"

# exit the script
exit 0