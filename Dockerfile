FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM deps AS build

COPY . .

RUN npm run build

FROM node:20-alpine AS backend

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY server.js ./
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "start"]

FROM build AS frontend

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
