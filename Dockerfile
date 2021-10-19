FROM node

WORKDIR /usr/server/uirapuru-api
COPY . .
EXPOSE 3000/tcp

CMD yarn start
