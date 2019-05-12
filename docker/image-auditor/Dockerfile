FROM node:4.3.1
EXPOSE 2205
COPY src /opt/app/
WORKDIR /opt/app/
RUN npm install
ENTRYPOINT ["node", "/opt/app/Auditor.js"]