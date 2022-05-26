FROM node:16.13.0

# アプリケーションディレクトリを作成する
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package*.json ./
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .
# typescriptでビルド
RUN npm run build

CMD [ "node", "./dist/index.js" ]