FROM node:20

WORKDIR /auth

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NAME AuthenticationService

CMD ["npx","ts-node", "server.ts"]