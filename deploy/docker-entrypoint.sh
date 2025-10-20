#!/bin/sh
set -e

# Ensure uploads directory has correct permissions
chown 1000 /uploads

# Run database migrations
python manage.py migrate

# Start Gunicorn with proper settings for serving media files
exec gunicorn stormnotes.wsgi:application \
    --workers ${GUNICORN_WORKERS:-2} \
    --threads ${GUNICORN_THREADS:-4} \
    --bind ${GUNICORN_BIND:-0.0.0.0:8000} \
    --access-logfile - \
    --error-logfile - \
    --log-level info
