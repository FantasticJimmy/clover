FROM node:18.17.1

WORKDIR /app

COPY ./dist/apps/backend/ ./
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install 



CMD [ "bash" ]