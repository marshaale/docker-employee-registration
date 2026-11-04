FROM node:24-alpine3.23 AS build

WORKDIR /app

COPY package*.json /app/

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

FROM node:24-alpine3.23

COPY --from=build /app /app

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

USER nonroot

ENV PORT=${PORT:-3000}
ENV NODE_ENV=production

EXPOSE ${PORT:-3000}

CMD ["node", "server.js"]