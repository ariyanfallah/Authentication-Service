FROM node:alpine

WORKDIR /auth

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 3008

ENV NAME AuthenticationService

CMD ["npx","ts-node", "server.ts"]