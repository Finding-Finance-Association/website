FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN apt-get update && apt-get upgrade -y && apt-get dist-upgrade -y && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["npm", "run", "dev"]

ENV \
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxOTDB5GK9TbAv6bz6pXyT1DCYWBJkBjg \
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ffatestproject.firebaseapp.com \
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=ffatestproject \
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ffatestproject.firebasestorage.app \
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=921395771761 \
  NEXT_PUBLIC_FIREBASE_APP_ID=1:921395771761:web:40f92f80bde391acd89ed0 \
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-F6LY613TVF


