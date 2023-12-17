#!/bin/bash

docker compose down -v

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker volume rm $(docker volume ls -q)

docker system prune -af

docker compose build
docker compose up