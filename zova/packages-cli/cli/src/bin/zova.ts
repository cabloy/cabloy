#!/usr/bin/env node

import { ZovaCommand } from '../start.ts';

main();

async function main() {
  new ZovaCommand().start();
}
