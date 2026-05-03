FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# 起動時に migrate と seed を流してから開発サーバを起動する。
# 学習用なので runserver でよい（本番は gunicorn を使う想定）。
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py seed_demo && python manage.py runserver 0.0.0.0:8000"]
