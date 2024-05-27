FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
RUN npm cache clean --force 
COPY . /app
RUN dnf upgrade -y
RUN dnf clean all
USER 1001
EXPOSE 8080
CMD npm start