FROM node:6-alpine

# set version for s6 overlay
ARG OVERLAY_VERSION="v1.18.1.5"
ARG OVERLAY_ARCH="amd64"

# environment variables
ENV PS1="$(whoami)@$(hostname):$(pwd)$ " \
HOME="/root" \
TERM="xterm"

EXPOSE 80 81 3000

RUN \
 apk add --no-cache --virtual=build-dependencies \
  curl \
  tar && \
 apk add --no-cache \
  bash \
  make \
  gcc \
  g++ \
  python \
  nginx \
  ca-certificates \
  coreutils \
  tzdata && \
 apk add --no-cache \
  --repository http://nl.alpinelinux.org/alpine/edge/community \
  shadow && \

 mkdir -p /run/nginx && \

# add s6 overlay
 curl -o \
 /tmp/s6-overlay.tar.gz -L \
  "https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.gz" && \
 tar xfz \
  /tmp/s6-overlay.tar.gz -C / && \

# clean up
 apk del --purge \
  build-dependencies && \
 rm -rf \
  /tmp/*

# Setup Webapp
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json

WORKDIR /app
RUN npm install

# Copy s6 config over
COPY ./docker/rootfs /

ADD ./ /app
RUN make build \
  && npm run build

ENTRYPOINT [ "/init" ]
