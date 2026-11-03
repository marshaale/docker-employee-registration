FROM node:24-alpine3.23

WORKDIR /app

COPY package.*json /app/

RUN npm install --omit=dev

COPY . .

ENV PORT=${PORT:-5000}

EXPOSE ${PORT:-5000}

CMD ["node", "server.js"]