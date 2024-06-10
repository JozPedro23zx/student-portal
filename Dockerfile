FROM node:20.5.1-slim

RUN npm install -g @nestjs/cli@10.1.17

WORKDIR /home/app

CMD ["tail", "-f", "/dev/null"]