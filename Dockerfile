# Multi-stage build for production

# Stage 1: Build frontend with Node.js and Vite
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

# Stage 2: Setup Python backend with uv
FROM python:3.12-slim AS backend-builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set up Python environment
WORKDIR /code

# Copy dependency files
COPY ./backend/pyproject.toml ./backend/uv.lock ./backend/.python-version ./

# Install dependencies using uv sync
RUN uv sync --frozen --no-dev

# Stage 3: Final production image
FROM python:3.12-slim

# Copy Python packages from builder (uv creates a .venv)
COPY --from=backend-builder /code/.venv /code/.venv

# Add virtualenv to PATH
ENV PATH="/code/.venv/bin:$PATH"

# Copy backend code
WORKDIR /code
COPY ./backend/ ./

# Copy built frontend assets
COPY --from=frontend-builder /app/dist/index.html /code/backend/templates/
COPY --from=frontend-builder /app/dist/static /static
COPY --from=frontend-builder /app/public/favicon.ico /static/favicon.ico

# Collect Django static files
RUN DJANGO_SECRET_KEY=none DEBUG=False python manage.py collectstatic --noinput

# Setup uploads directory
RUN mkdir -p /uploads && chown 1000:1000 /uploads

# Add entrypoint script
COPY ./deploy/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 8000

ENV DEBUG=False \
    GUNICORN_WORKERS=2 \
    GUNICORN_THREADS=4 \
    GUNICORN_BIND=0.0.0.0:8000

CMD ["/docker-entrypoint.sh"]
