FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

WORKDIR /app/backend

RUN pip install --upgrade pip 

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod -R 755 /app/backend && \
    chmod -R 777 /app/backend/media && \
    chmod -R 777 /app/backend/static_files && \
    chmod +x /app/backend/manage.py

RUN mkdir -p /app/backend/media /app/backend/static
