#! /usr/bin/env bash

lerna publish $1 --yes
git checkout -- "**/package.json"
