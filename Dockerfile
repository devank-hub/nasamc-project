FROM node:lts-alpine3.10
# loading base-image where loading lts version of node

WORKDIR /app
# defining the folder for the container/image to load

COPY package.json ./
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)

COPY client/package.json client/
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)
RUN npm run install-client --only=production
# installing the dependencies excluding the dev dependencies

COPY server/package.json server/
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)
RUN npm run install-server --only=production
# installing the dependencies excluding the dev dependencies

COPY client/ client/
RUN npm run build --prefix client
# building the client

COPY server/ server/

USER node
# setting the user to node instead of root to run the app

CMD [ "npm", "start", "--prefix", "server" ]
# running the server by defining keyword which are gonna be used to run the server

EXPOSE 8000
# exposing the port to the host 