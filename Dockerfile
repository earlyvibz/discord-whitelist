FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY . /app

CMD ["npm", "start"]

