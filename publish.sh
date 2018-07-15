#!/bin/bash

docker build -t chantr-web:vnext .;

docker stop chantr-web-vnext;
docker rm chantr-web-vnext-prev;
docker rename chantr-web-vnext chantr-web-vnext-prev;

docker run -d --restart=always -p 9002:8080 --name chantr-web-vnext chantr-web:vnext;

docker logs --tail=all -f chantr-web-vnext;
