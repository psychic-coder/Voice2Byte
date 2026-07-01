FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We can skip build during compose since dev mode is easier for MVP, but let's provide a dev-friendly approach
# Since MVP frontend is in Next 13 but uses 'next dev' in scripts, we'll just run it in dev mode for the container to avoid build issues.
CMD ["npm", "run", "dev"]
