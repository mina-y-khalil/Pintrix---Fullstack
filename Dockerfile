#STAGE 1 FRONT END REACT
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY react-vite/package*.json ./
RUN npm install
COPY react-vite/ .
RUN npm run build

#STAGE 2 BACKEND FLASK
FROM python:3.9.18-alpine3.18

RUN apk add --no-cache build-base postgresql-dev postgresql-client gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt psycopg2-binary

COPY . .
COPY --from=frontend-build /frontend/dist ./react-vite/dist

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]