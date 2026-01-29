#!/bin/bash

# Script to generate a TypeORM migration
# Usage: ./scripts/generate-migration.sh MigrationName

if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: ./scripts/generate-migration.sh MigrationName"
  exit 1
fi

MIGRATION_NAME=$1

npm run migration:generate src/core/database/migrations/$MIGRATION_NAME

echo "Migration generated: src/core/database/migrations/$MIGRATION_NAME"
