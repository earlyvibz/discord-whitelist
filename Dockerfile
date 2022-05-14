FROM node:latest

RUN mkdir -p /whitelist
WORKDIR /whitelist

COPY package.json /whitelist
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY . /whitelist

ENV DISCORD_TOKEN=OTY5NTQyODE2ODMxMjQ2NDU2.Ymu7HA.gj6bjmFh2GwqPfI0HYwxRhu67zc
ENV CLIENT_ID=969542816831246456
ENV GUILD_ID=796867359247040573
ENV DATABASE=mongodb+srv://lucas:KeySWk5XYu9N19Vb@earliverse.pi7fg.mongodb.net/whitelist?retryWrites=true&w=majority
ENV ALCHEMY_API=0AliTcweYOFka9HJch6ju4EJxykCYLjB

CMD ["npm", "start"]

