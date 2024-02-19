FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Make port 4000 available to the world outside this container
EXPOSE 4000

CMD [ "npm", "run", "start:dev" ]