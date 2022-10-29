#!/usr/bin/env bash

cp /opt/node/app/dist/* -r /root/output/app/dist
npm run start:backend
