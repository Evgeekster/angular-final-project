#!/bin/bash




python3 manage.py collectstatic --noinput

python manage.py makemigrations --noinput

python3 manage.py migrate --noinput

python i.py
# Load initial data (if needed)
# python manage.py reset_db --noinput --close-sessions

# python3 manage.py loaddata b.json

# exec uvicorn server.wsgi:application --host 0.0.0.0 --port 8000 --reload
python3 manage.py runserver 0.0.0.0:8000