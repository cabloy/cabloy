#! /usr/bin/env bash

REPO=$(git config --get remote.origin.url | sed 's/git@\(.*\):\(.*\)\.git/http:\/\/\1\/\2/g')
FORMAT="  * [[\`%h\`]($REPO/commit/%H)] - %s (%aN <<%ae>>)"

git fetch
git log --pretty=format:"$FORMAT" --no-merges
