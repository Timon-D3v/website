FROM node:24-slim

WORKDIR /portfolio

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY dist ./dist
COPY public ./public

RUN mkdir cert

CMD ["node", "dist/server/server.mjs"]
