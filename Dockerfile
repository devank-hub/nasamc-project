FROM node:16-alpine
# loading base-image where loading lts version of node

WORKDIR /app
# defining the folder for the container/image to load

COPY package.json ./
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)
RUN npm install --only=production
# installing dependencies from main package.json

COPY client/package.json client/
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)
RUN npm run install-client --only=production
# installing the dependencies excluding the dev dependencies

COPY server/package.json server/
# copying the package.json and packaghe-lock.json from the host to the container(here from nasa project folder to app folder)
RUN npm run install-server --only=production
# installing the dependencies excluding the dev dependencies

COPY client/ client/
# copying the client folder from host to container client folder
RUN npm run build --prefix client
# building the client production files
# before above one to execute ,for building the client we need to change 
# this "set BUILD_PATH=../server/public&& react-scripts build" to "BUILD_PATH=../server/public react-scripts build" in client folder
# above only valid for linux images and not for windows images

COPY server/ server/
# copying the server folder from host to container server folder

USER node
# setting the user to node instead of root to run the app

CMD [ "npm", "start", "--prefix", "server" ]
# running the server by defining keyword which are gonna be used to run the server

EXPOSE 8000
# exposing the port to the host 