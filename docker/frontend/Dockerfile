FROM node:12.2.0-alpine

WORKDIR /app

COPY /frontend/package.json /app/package.json
RUN npm install --silent

CMD npm rebuild node-sass && npm start
