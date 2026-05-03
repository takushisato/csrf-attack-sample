# --- build stage ----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# --- runtime stage --------------------------------------------------------
# 学習用に開発サーバ (vite dev) で動かす。本番運用は想定しない。
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
