FROM node:16
WORKDIR /app
COPY package.json ./app
RUN npm install -g -s --no-progress yarn && \
    yarn
COPY . ./app
EXPOSE 8080
COPY [ "yarn", "start" ]