#! /usr/bin/env bash

lerna version $1 --yes
pnpm publish -r
