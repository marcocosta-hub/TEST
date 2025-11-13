# This default may be swapped for any compatible base image
ARG BASE_IMAGE=ubuntu:24.04

# This buildpack is used for tool installation and user/directory setup
FROM containerbase/base:13.5.8 AS containerbase

FROM ${BASE_IMAGE} as base

RUN apt-get update -y && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

ARG USER_NAME=user
ARG USER_ID=1542
ARG APP_ROOT=/usr/src/app

# Set env and shell
ENV BASH_ENV=/usr/local/etc/env
SHELL ["/bin/bash" , "-c"]

# Set up containerbase
COPY --from=containerbase /usr/local/sbin/ /usr/local/sbin/
COPY --from=containerbase /usr/local/containerbase/ /usr/local/containerbase/
RUN install-containerbase && \
    prepare-tool all

# renovate: datasource=docker depName=openjdk versioning=docker
ARG JAVA_VERSION=17.0.9+9
RUN install-tool java

# END OF BASE IMAGE

# copy folder
COPY docker-image/ /

# Expose ports
# HTTP
EXPOSE 5678

# home directory
ENV HOME=/etc/usr/local/whitesource
ENV WHITESOURCE_HOME=$HOME
ENV BOLT4SCM_HOME=$HOME/bolt4scm

ARG JAVA_OPTS
ENV JAVA_OPTS=${JAVA_OPTS}
ENV JDK_JAVA_OPTIONS "--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.net=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED"

RUN chmod -R ugo+rw $HOME && chmod +x /start.sh

USER $USER_ID

# This entry point ensures that dumb-init is run
ENTRYPOINT [ "docker-entrypoint.sh" ]
# Mend traceability labels
LABEL io.mend.image.dockerfile.path=integration/bolt-packaging/wss-ghe-app/src/assembly-staging/docker/Dockerfile
LABEL org.opencontainers.image.source=https://github.com/whitesource/thunder

CMD [ "./start.sh" ]
