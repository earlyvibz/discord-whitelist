FROM node:16-alpine

RUN mkdir -p /whitelist
WORKDIR /whitelist

COPY package.json ./whitelist
COPY tsconfig.json ./whitelist
COPY . /whitelist
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install
RUN npm run build

CMD ["npm", "start"]

