FROM node:20 as builder

RUN apt-get update && apt-get install --no-install-recommends --yes openssl

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build 

FROM node:20

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

EXPOSE 3333

CMD ["npm", "run", "start:migrate:prod"]

