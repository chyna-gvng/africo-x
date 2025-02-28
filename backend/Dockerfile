FROM bitnami/node:latest

# Install jq and other dependencies
RUN apt-get update && apt-get install -y jq openssl curl netcat-openbsd

# Set working directory
WORKDIR /app

# Create directory for the backend
RUN mkdir -p /app/backend

# Add the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
