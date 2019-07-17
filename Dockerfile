FROM node:8-alpine

WORKDIR /home/ypahilwan/app

COPY package*.json /home/ypahilwan/app/

COPY . /home/ypahilwan/app

EXPOSE 3000

CMD [ "npm", "start" ]