FROM node:alpine
WORKDIR /app
COPY package.json ./app
RUN yarn
COPY . ./app
COPY ["yarn","start"]