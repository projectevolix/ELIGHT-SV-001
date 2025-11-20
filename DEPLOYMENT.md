# ELIGHT-SV-001 Frontend Deployment Guide

## Project Overview

**Technology Stack:**

- Framework: Next.js 15.3.3
- Runtime: Node.js 20+
- Language: TypeScript
- UI Library: React 18.3.1
- Styling: Tailwind CSS 3.4.1
- State Management: Zustand 5.0.8
- Data Fetching: React Query (TanStack) 5.90.2
- Form Handling: React Hook Form 7.54.2

**Key Features:**

- Server-side rendering with Next.js
- Type-safe development with TypeScript
- Responsive UI with Radix UI components
- Real-time data fetching with React Query
- Dynamic routing and API integration
- Player, Coach, Tournament, and Registration management

## Docker Deployment

### Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 1.29+)
- Backend API running (default: http://localhost:8080/api/v1/sv-backend-service)

### Build Docker Image

```bash
# Build the Docker image
docker build -t elight-frontend:latest .

# Or build with tag for registry
docker build -t your-registry/elight-frontend:latest .
```

### Run with Docker

```bash
# Run with environment variable
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://your-backend-api:8080/api/v1/sv-backend-service \
  elight-frontend:latest

# Run with custom port
docker run -p 8000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://your-backend-api:8080/api/v1/sv-backend-service \
  elight-frontend:latest
```

### Run with Docker Compose

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Build and run fresh
docker-compose up -d --build
```

### Environment Variables

Set these environment variables when running the container:

- **NEXT_PUBLIC_API_BASE_URL** (required)

  - Backend API base URL
  - Example: `http://localhost:8080/api/v1/sv-backend-service`
  - Example (production): `https://api.yourdomain.com/api/v1/sv-backend-service`

- **NODE_ENV** (optional, default: production)
  - Set to `production` for optimized builds
  - Set to `development` for debug mode

### Example: Docker Run for Dev Server

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://sv-backend-service:8080/api/v1/sv-backend-service \
  --name elight-frontend \
  --restart unless-stopped \
  elight-frontend:latest
```

### Example: Docker Compose for Dev Server

Update `docker-compose.yml` environment variables:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_BASE_URL=http://sv-backend-service:8080/api/v1/sv-backend-service
```

Then run:

```bash
docker-compose up -d
```

## Image Details

### Multi-stage Build Strategy

The Dockerfile uses a 3-stage build for optimal image size and security:

1. **deps** - Install production dependencies only
2. **builder** - Build the application with all dependencies
3. **runner** - Lean production image with only built artifacts

### Image Specifications

- **Base Image**: node:20-alpine (≈150MB)
- **Final Image Size**: ~250-300MB (estimated)
- **Non-root User**: `nextjs` (UID: 1001) for security
- **Working Directory**: `/app`
- **Port**: 3000 (configurable)

### Health Check

The image includes a health check that:

- Runs every 30 seconds
- Times out after 10 seconds
- Retries up to 3 times
- Waits 5 seconds before first check

Access health status:

```bash
docker ps  # Look for "healthy" status
docker inspect <container-id> | grep -A 5 "Health"
```

## Performance Optimization

### Build Configuration

- **Standalone Build**: Next.js builds a standalone server (no node_modules needed in runtime)
- **Static Export**: Prerendered static pages for fast delivery
- **Image Optimization**: Configured for edge deployments

### Runtime Optimization

- Alpine Linux base image (minimal bloat)
- dumb-init process manager (proper signal handling)
- Non-root user execution (security best practice)
- Health checks enabled (orchestrator support)

## Kubernetes Deployment (Optional)

### Create ConfigMap for environment

```bash
kubectl create configmap elight-frontend-config \
  --from-literal=NEXT_PUBLIC_API_BASE_URL=http://backend-api:8080/api/v1/sv-backend-service
```

### Example Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elight-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: elight-frontend
  template:
    metadata:
      labels:
        app: elight-frontend
    spec:
      containers:
        - name: frontend
          image: your-registry/elight-frontend:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: NEXT_PUBLIC_API_BASE_URL
              valueFrom:
                configMapKeyRef:
                  name: elight-frontend-config
                  key: NEXT_PUBLIC_API_BASE_URL
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: elight-frontend
spec:
  selector:
    app: elight-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Cloud Platform Deployments

### Google Cloud Run

```bash
# Build and push
docker build -t gcr.io/YOUR_PROJECT/elight-frontend:latest .
docker push gcr.io/YOUR_PROJECT/elight-frontend:latest

# Deploy
gcloud run deploy elight-frontend \
  --image gcr.io/YOUR_PROJECT/elight-frontend:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL=https://your-backend-api/api/v1/sv-backend-service
```

### AWS ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
docker tag elight-frontend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/elight-frontend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/elight-frontend:latest
```

### Azure Container Instances

```bash
az acr build --registry YOUR_REGISTRY --image elight-frontend:latest .
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs <container-id>

# Check health
docker ps -a  # Look for status
```

### Port already in use

```bash
# Use different port
docker run -p 8000:3000 elight-frontend:latest

# Kill existing process on port 3000
# Windows: netstat -ano | findstr :3000
# Linux: lsof -i :3000
```

### API connection issues

```bash
# Verify environment variable
docker inspect <container-id> | grep NEXT_PUBLIC_API_BASE_URL

# Test connectivity from container
docker exec <container-id> wget http://backend-api:8080/api/v1/sv-backend-service
```

### Build failures

```bash
# Clean build
docker system prune -a
docker build --no-cache -t elight-frontend:latest .

# Check Node version compatibility
docker run node:20-alpine node --version
```

## Security Best Practices

✅ Implemented:

- Non-root user execution
- Alpine Linux base (minimal attack surface)
- Minimal final image with only runtime dependencies
- Process manager (dumb-init) for proper signal handling
- Health checks enabled

Recommended:

- Run containers with read-only root filesystem when possible
- Use network policies to restrict traffic
- Scan images for vulnerabilities: `docker scout cves elight-frontend`
- Use secrets management for sensitive environment variables
- Enable container runtime security monitoring

## Performance Tuning

### Memory

```bash
# Adjust memory limits in docker-compose.yml or Kubernetes manifests
docker run -m 512m elight-frontend:latest
```

### CPU

```bash
# Adjust CPU shares
docker run --cpus 1 elight-frontend:latest
```

### Replica Scaling (Docker Swarm/Kubernetes)

```bash
# In production, run 2-3 replicas for high availability
# Use load balancing (Nginx, AWS ALB, etc.)
```

## Monitoring

### Basic Monitoring

```bash
# Container stats
docker stats <container-id>

# View logs with timestamps
docker logs --timestamps -f <container-id>

# Check container inspection
docker inspect <container-id>
```

### Production Monitoring (Recommended)

- Use container orchestration platform monitoring (Kubernetes metrics, Docker Swarm)
- Set up application performance monitoring (APM)
- Enable access logs to analyze traffic patterns
- Set up alerts for health check failures

## Support & Updates

For updates to the deployment:

1. Pull latest source code changes
2. Rebuild the Docker image
3. Push to registry
4. Redeploy using docker-compose or orchestration platform

To update dependencies:

```bash
npm update
docker build -t elight-frontend:latest .
```

---

**Last Updated**: November 20, 2025
**Next.js Version**: 15.3.3
**Node.js Version**: 20 (Alpine)
