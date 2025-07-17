#!/bin/sh

echo "Waiting for database to be ready..."
# Wait for Postgres to accept connections
until pg_isready -d "$DATABASE_URL"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

echo "Running database migrations..."
flask db upgrade

echo "Seeding database (optional)..."
flask seed all || echo "Skipping seed if fails"

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:5000 app:app
