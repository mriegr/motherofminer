FROM node:6.11.3

RUN mkdir -p /src/data/uploads
RUN npm install -g -q gulp forever

WORKDIR /src

ADD package.json /src/package.json
RUN npm install

CMD ["npm", "start"]