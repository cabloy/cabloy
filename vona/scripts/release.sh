#! /usr/bin/env bash

lerna version $1 --yes
git add .
git commit -m 'chore: release'
git push
lerna version patch --yes
pnpm publish -r

