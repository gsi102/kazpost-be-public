FROM amd64/node:16.20-slim

ENV NODE_ENV production

WORKDIR /app

COPY package.json /app

RUN apt-get update && apt-get install -y \
  libreoffice

RUN yarn

COPY /build/dist/ .

ENV PORT 3001

EXPOSE $PORT

CMD [ "node", "app.js" ]
