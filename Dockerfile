FROM node:20

WORKDIR /app

COPY ./package*.json .
COPY ./tsconfig*.json .

RUN npm install

COPY src ./src

EXPOSE 3002
CMD ["npm", "run", "start:dev"]