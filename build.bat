REM Build and tag wss-ghe-app
REM docker build -t wss-ghe-app:25.9.1 wss-ghe-app-25.9.1/docker
docker build -t wss-ghe-app:25.9.1 wss-ghe-app/docker

REM Build and tag wss-scanner
REM docker build -t wss-scanner:${wss-scanner.version} wss-scanner-${wss-scanner.version}/docker
docker build -t wss-scanner:25.9.1.3 wss-scanner/docker

REM Build and tag wss-remediate
REM docker build -t wss-remediate:25.9.1 wss-remediate-25.9.1/docker
docker build -t wss-remediate:25.9.1 wss-remediate/docker
