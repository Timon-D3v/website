FROM node:22.14.0-alpine3.20

WORKDIR /build

COPY package*.json .

RUN npm install --omit=dev
RUN npm cache clean --force

COPY dist dist
COPY public public
COPY uploads uploads

CMD ["node", "dist/server/server.mjs"]