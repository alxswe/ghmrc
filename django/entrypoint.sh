#!/bin/bash

echo "Collect static files"
python3 manage.py collectstatic --no-input --clear > /dev/null 2>&1

echo "Running migrations"
python3 manage.py makemigrations > /dev/null 2>&1
python3 manage.py migrate > /dev/null 2>&1

# Start server
echo "Starting server"
honcho start

# daphne command will keep the script running
# if you need for other reasons, uncomment it
# exec "$@"
