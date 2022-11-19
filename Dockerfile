FROM node:18-alpine3.16 AS build
WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY .eleventy.js .
COPY static/ ./static

RUN npm run build

FROM nginx:1.23.2-alpine AS server
COPY --from=build /home/node/app/static/dist /usr/share/nginx/html
