# ---------- Stage 1: Build React (Vite) frontend ----------
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Copy and install only frontend files
COPY react-vite/package*.json ./
COPY react-vite/vite.config.* ./
COPY react-vite/src ./src
COPY react-vite/public ./public

# Install dependencies and build
RUN npm ci || npm install
RUN npm run build

# ---------- Stage 2: Build Flask backend ----------
FROM python:3.9.18-alpine3.18

WORKDIR /var/www

# Install system dependencies for psycopg2 and builds
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir psycopg2

# Copy backend code
COPY app ./app
COPY migrations ./migrations
COPY alembic.ini* .    
COPY config.py* .      
COPY start.sh .        

# Create static dir and copy React build from previous stage
RUN mkdir -p app/static
COPY --from=frontend-build /frontend/dist ./app/static/

EXPOSE 5000

CMD ["gunicorn", "app:app"]