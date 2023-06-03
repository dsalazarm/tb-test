FROM node:16
LABEL MAINTAINER Danny Salazar <dssm_15@hotmail.com>

WORKDIR /usr/src/app
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
