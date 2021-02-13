FROM node:12-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

COPY package-lock.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
