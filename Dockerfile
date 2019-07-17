FROM node:8-alpine

WORKDIR /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]