FROM node:12.2.0-alpine

WORKDIR /app

COPY /frontend/package.json /app/package.json
RUN npm install
COPY /frontend/tsconfig.json /app/tsconfig.json
COPY /frontend/public /app/public
COPY /frontend/src /app/src

CMD npm test
