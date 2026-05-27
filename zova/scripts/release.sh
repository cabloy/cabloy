#! /usr/bin/env bash

lerna version $1 --yes --no-push
git push
pnpm publish -r

npm run build:ssr:cabloyBasicBatch
npm run build:ssr:testSecondBatch
git add .
git commit -m 'chore: release' || true
git push
