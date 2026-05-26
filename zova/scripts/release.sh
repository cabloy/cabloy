#! /usr/bin/env bash

lerna version $1 --yes
pnpm publish -r

npm run build:ssr:cabloyBasicBatch
npm run build:ssr:testSecondBatch
