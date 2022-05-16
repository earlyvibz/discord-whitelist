FROM node:16-alpine

RUN mkdir -p /whitelist
WORKDIR /whitelist

COPY package.json ./whitelist
COPY tsconfig.json ./whitelist
COPY . /whitelist
RUN npm install

CMD ["npm", "start"]

