#!/bin/bash

# Build and tag wss-ghe-app
# docker build -t wss-ghe-app:25.9.1 wss-ghe-app-25.9.1/docker
docker build -t wss-ghe-app:25.9.1 wss-ghe-app/docker

# Build and tag wss-scanner
# docker build -t wss-scanner:${wss-scanner.version} wss-scanner-${wss-scanner.version}/docker
docker build -t wss-scanner:25.9.1.3 wss-scanner/docker

# Build and tag wss-scanner-sast
# docker build -t wss-scanner-sast:${wss-scanner.version} wss-scanner-${wss-scanner.version}/docker
docker build -t wss-scanner-sast:25.9.1.3 -f wss-scanner/docker/DockerfileSast wss-scanner/docker

# Build and tag wss-remediate
# docker build -t wss-remediate:25.9.1 wss-remediate-25.9.1/docker
docker build -t wss-remediate:25.9.1 wss-remediate/docker
