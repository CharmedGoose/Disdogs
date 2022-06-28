FROM node:16-buster-slim as base

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node assets/ assets/
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

ENTRYPOINT ["dumb-init", "--"]

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.base.json tsconfig.base.json
COPY --chown=node:node src/ src/

RUN yarn install --immutable
RUN yarn run build

FROM base AS runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps --max_old_space_size=4096"

COPY --chown=node:node --from=builder /usr/src/app/dist dist

RUN yarn workspaces focus --all --production
RUN chown node:node /usr/src/app/

USER node

CMD [ "yarn", "run", "start" ]