FROM node:14-alpine

WORKDIR /APP

ADD . /APP

RUN npm i

CMD npm start 