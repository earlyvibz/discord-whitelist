FROM node:latest

RUN mkdir -p /discord-whitelist
WORKDIR /discord-whitelist

COPY package.json /discord-whitelist
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY . /discord-whitelist

CMD ["npm", "start"]

