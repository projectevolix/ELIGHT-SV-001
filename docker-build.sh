#!/bin/bash

# ELIGHT-SV-001 Frontend Docker Build Script
# Usage: ./docker-build.sh [tag] [registry]
# Example: ./docker-build.sh latest myregistry.azurecr.io

set -e

# Default values
TAG="${1:-latest}"
REGISTRY="${2:-}"
IMAGE_NAME="elight-frontend"
FULL_IMAGE_NAME="${REGISTRY:+$REGISTRY/}$IMAGE_NAME:$TAG"

echo "================================"
echo "ELIGHT-SV-001 Frontend Build"
echo "================================"
echo "Image: $FULL_IMAGE_NAME"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker."
    exit 1
fi

echo "📦 Building Docker image..."
docker build -t "$FULL_IMAGE_NAME" .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Next steps:"
    echo "  - Run locally: docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1/sv-backend-service $FULL_IMAGE_NAME"
    echo "  - Run with Docker Compose: docker-compose up"
    
    if [ -n "$REGISTRY" ]; then
        echo "  - Push to registry: docker push $FULL_IMAGE_NAME"
    fi
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
