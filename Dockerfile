FROM node:22.14.0-alpine3.20

WORKDIR /build

COPY package*.json .

RUN npm install --omit=dev
RUN npm cache clean --force

COPY dist dist
COPY public public

RUN mkdir /build/uploads
RUN mkdir /uploads

RUN mkdir /build/uploads/chunks
RUN mkdir /uploads/chunks

RUN mkdir /build/uploads/files
RUN mkdir /uploads/files

RUN mkdir /build/uploads/meta
RUN mkdir /uploads/meta

RUN mkdir /build/uploads/profile
RUN mkdir /uploads/profile

RUN mkdir /build/uploads/projects
RUN mkdir /uploads/projects

CMD ["node", "dist/server/server.mjs"]