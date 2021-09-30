FROM node:14.17.6-alpine

# Change working directory
WORKDIR /usr/app

# Bundle app source
COPY ./dist ./dist
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install --production

CMD ["npm", "start"]