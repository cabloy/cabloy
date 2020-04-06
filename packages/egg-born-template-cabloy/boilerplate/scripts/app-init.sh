#!/usr/bin/env bash

cp /opt/node/app/dist/* -r /root/output/app/dist
exec npx egg-born-scripts backend-start

