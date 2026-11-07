# 원격플러그인 피시 (UNPLUG 원격 PC방) Next.js 프론트엔드 Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
