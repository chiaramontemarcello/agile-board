FROM node:alpine3.13 AS builder

WORKDIR /usr/src/app

COPY ./source/package.json .
COPY ./source/package-lock.json .

RUN npm ci

COPY ./source .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/dist/atouch-frontend /usr/share/nginx/html
