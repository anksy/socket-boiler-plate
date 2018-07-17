FROM node:8.11.1-alpine
LABEL maintainer FLEXSIN

# 80 = HTTP, 443 = HTTPS, 8017 = NODEJS server, 8025 = Socket server
EXPOSE 80 443 8025 8026



RUN mkdir -p /opt/appraisersocket
WORKDIR /opt/appraisersocket

ENV NODE_ENV production

ENV MONGODB_URL mongodb://tgmongodb:0z0giNrTFRjlgXEc3tmxioHnu3Kiw6mXcpOY1UBP31VDfT9HN6Ayh1Y515YsgeH6AZoODa1A5YSfiLkv9IwQJg==@tgmongodb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/appraisersocket/


# Install NODEJS Prerequisites
RUN npm install --quiet -g pm2

RUN npm install --quiet --only=production

# Install bower packages
#COPY bower.json /opt/appraisersocket/bower.json

COPY . /opt/appraisersocket 

# Run NODEJS server
#CMD npm install --only=production && npm start

# To RUN USING PM2 DOCKER
CMD ["pm2-docker", "bin/exec.json"]