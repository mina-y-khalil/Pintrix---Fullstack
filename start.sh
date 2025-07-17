#!/usr/bin/env sh
set -e

echo "Running database migrations..."
flask db upgrade   


if [ "$RUN_DB_SEED" = "true" ]; then
  echo "Seeding database..."
  flask seed all
fi

echo "Starting Gunicorn..."
exec gunicorn app:app
