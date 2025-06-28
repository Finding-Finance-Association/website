FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN apt-get update && apt-get upgrade -y && apt-get dist-upgrade -y && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["npm", "run", "dev"]

