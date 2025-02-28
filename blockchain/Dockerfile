FROM bitnami/node:18.20.5

# Install necessary tools
RUN apt-get update && apt-get install -y netcat-openbsd curl openssl

# Set working directory
WORKDIR /app

# Create directory for the build artifacts
RUN mkdir -p /app/blockchain/build

# Add the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
