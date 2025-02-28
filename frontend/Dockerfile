FROM bitnami/node:latest

# Set working directory
WORKDIR /app

# Create directory for the frontend
RUN mkdir -p /app/frontend

# Add the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
