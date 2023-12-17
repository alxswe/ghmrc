# syntax=docker/dockerfile:1

FROM nginx:alpine


RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]
