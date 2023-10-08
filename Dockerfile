FROM node:latest 

WORKDIR /app

COPY . .

RUN npm install typescript -g

RUN npm install nodemon -g

RUN npm install ts-node -g