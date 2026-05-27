#! /usr/bin/env bash

lerna version $1 --yes
git push
git push --tags
pnpm publish -r
