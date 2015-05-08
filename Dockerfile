FROM node:slim

MAINTAINER Lovell Felix, hello@lovellfelix.com

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g gulp-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /home/mean/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/mean

# currently only works for development
ENV NODE_ENV development
ENV DB_1_PORT_27017_TCP_ADDR 45.55.162.183

VOLUME ["/home/mean"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]
