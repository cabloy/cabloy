#! /usr/bin/env bash

lerna version $1 --yes --no-push
git push
pnpm publish -r
