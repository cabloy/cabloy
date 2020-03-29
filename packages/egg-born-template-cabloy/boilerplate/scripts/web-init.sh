#!/usr/bin/env bash

cp /opt/node/web/dist/* -r /root/output/web/dist
exec npx egg-born-scripts backend-start

