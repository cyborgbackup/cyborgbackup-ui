### STAGE 1: Build ###
FROM node:13.2-alpine AS build
RUN apk add git
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.18.0-alpine
COPY share/nginx.docker /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html