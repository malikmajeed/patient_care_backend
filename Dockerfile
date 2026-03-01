# patient_care_backend - Node.js API
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy application
COPY server.js ./
COPY src ./src

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "server.js"]
