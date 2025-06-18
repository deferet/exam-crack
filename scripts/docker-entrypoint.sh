#!/bin/sh
set -e

# Wait for the the db
if [ -n "$EXAMCRACK_DB_DSN" ]; then
    ./wait-for-it.sh "$DB_HOST:${DB_PORT:-5432}" --timeout=30 --strict -- echo "Database is up"
fi

exec "$@"