FROM node:latest

RUN mkdir -p /whitelist
WORKDIR /whitelist

COPY package.json /whitelist
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY . /whitelist

# Start the bot.
CMD ["npm", "start"]

