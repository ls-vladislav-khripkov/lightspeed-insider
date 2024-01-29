# syntax=docker/dockerfile:1.6
ARG BASE_IMAGE=809245501444.dkr.ecr.us-east-1.amazonaws.com/release/internal/image/docker-node-20:latest-main

# Install all node_modules, including dev dependencies
FROM ${BASE_IMAGE} as deps

WORKDIR /app

ADD package.json yarn.lock ./
RUN --mount=type=cache,target=/home/worker/.cache/yarn,uid=100,gid=1001\
    yarn install --frozen-lockfile --production=false

# Setup production node_modules
FROM ${BASE_IMAGE} as production-deps

ENV NODE_ENV production

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json yarn.lock ./
RUN --mount=type=cache,target=/home/worker/.cache/yarn,uid=100,gid=1001\
    yarn install --frozen-lockfile --production=true

# Build the app
FROM ${BASE_IMAGE} as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY ./package.json ./yarn.lock ./remix.config.mjs ./remix.env.d.ts ./tsconfig.json /app/
COPY ./src /app/src
RUN --network=none yarn --offline build

# Finally, build the production image with minimal footprint
FROM ${BASE_IMAGE} as production

ENV NODE_ENV production

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY ./config /app/config

ENV HOST 0.0.0.0
ENV PORT 3000
EXPOSE 3000
# Since the command is run with node, we can't depend on npm to figure this path for us
# TODO maybe there's a better way?
CMD ["node_modules/@remix-run/serve/dist/cli.js", "./build/index.js"]
