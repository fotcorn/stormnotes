#!/bin/bash
set -euo pipefail

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Creating temporary backup directory: $TEMP_DIR"

# Create backups directory if it doesn't exist
mkdir -p backups

echo "Starting backup process..."

# Get container names
POSTGRES_CONTAINER=$(docker-compose -f docker-compose-local.yaml ps -q postgres)
REDIS_CONTAINER=$(docker-compose -f docker-compose-local.yaml ps -q redis)

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker-compose -f docker-compose-local.yaml exec postgres pg_dump -U postgres postgres > "$TEMP_DIR/postgres_backup.sql"

# Backup Redis
echo "Backing up Redis..."
docker-compose -f docker-compose-local.yaml exec redis redis-cli SAVE
docker cp "${REDIS_CONTAINER}:/data/dump.rdb" "$TEMP_DIR/redis_dump.rdb"

# Create tar.gz archive
echo "Creating compressed archive..."
tar -czf "backups/stormnotes_backup_${TIMESTAMP}.tar.gz" -C "$TEMP_DIR" .

# Cleanup
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Backup completed!"
echo "Backup file: backups/stormnotes_backup_${TIMESTAMP}.tar.gz"
