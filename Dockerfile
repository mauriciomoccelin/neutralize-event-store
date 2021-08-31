FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . .
EXPOSE 80
CMD [ "npm", "run", "start" ]