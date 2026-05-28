#! /usr/bin/env bash

lerna version $1 --yes
lerna publish from-git
