FROM node

WORKDIR /usr/server/app
COPY . .
EXPOSE 3000/tcp

CMD yarn dev
