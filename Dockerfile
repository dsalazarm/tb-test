FROM node:16
LABEL MAINTAINER Danny Salazar <dssm_15@hotmail.com>

RUN npm install pm2@latest --global --quiet

WORKDIR /usr/src/app
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm ci --only=production

EXPOSE 8080

CMD ["pm2-runtime", "./config/pm2.json"]
