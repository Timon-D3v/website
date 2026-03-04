FROM node:24.14.0-alpine3.23

WORKDIR /portfolio

COPY package*.json .

COPY dist dist
COPY public public

RUN mkdir cert

RUN npm install --omit=dev
RUN npm cache clean --force

CMD ["node", "dist/server/server.mjs"]