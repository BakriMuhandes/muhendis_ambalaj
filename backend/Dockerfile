FROM node:20-slim
# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
# 2. Copy the prisma schema BEFORE installing dependencies 
# so the postinstall 'prisma generate' script can find it!
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]