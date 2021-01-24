FROM node:14

WORKDIR /api/app
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3002

CMD [ "node", "app.js"]