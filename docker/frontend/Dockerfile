FROM node:12.2.0-alpine

WORKDIR /app

COPY /frontend/package.json /app/package.json
RUN npm install --silent

CMD npm rebuild node-sass && REACT_APP_BACKEND_URL=$BACKEND_URL npm start
