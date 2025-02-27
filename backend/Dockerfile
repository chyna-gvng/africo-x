FROM bitnami/node:latest

# Install jq and other dependencies
RUN apt-get update && apt-get install -y jq openssl curl

# Create directory for the script
RUN mkdir -p /app

# Add the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
