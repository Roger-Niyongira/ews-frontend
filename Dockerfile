# Dockerfile for frontend
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# Development: keep the process alive
CMD ["npm", "start"]