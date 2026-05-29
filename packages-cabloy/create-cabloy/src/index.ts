#!/usr/bin/env node

import * as p from '@clack/prompts';
import mri from 'mri';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import pc from 'picocolors';

import { runPrompts } from './prompts.ts';
import { downloadAndExtract, spawnAsync } from './utils.ts';

function printHelp() {
  p.log.info(`
  ${pc.bold('create-cabloy')} - Create a new Cabloy project

  ${pc.bold('Usage:')}
    ${pc.cyan('npm create cabloy')} ${pc.dim('<project-name>')}
    ${pc.cyan('pnpm create cabloy')} ${pc.dim('<project-name>')}
    ${pc.cyan('yarn create cabloy')} ${pc.dim('<project-name>')}

  ${pc.bold('Options:')}
    --force             Overwrite existing directory
    -h, --help          Show this help message
    -v, --version       Show version number
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const args = mri(argv, {
    boolean: ['force', 'help', 'version'],
    alias: { h: 'help', v: 'version' },
  });

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.version) {
    const { default: pkg } = await import('../package.json', { with: { type: 'json' } });
    p.log.info(pkg.version);
    process.exit(0);
  }

  const result = await runPrompts({
    projectName: args._[0],
    force: args.force,
  });

  if (!result) {
    process.exit(0);
  }

  // Determine target directory
  const targetDir = resolve(process.cwd(), result.projectName);

  // Check if target directory exists and is not empty
  if (existsSync(targetDir)) {
    const files = await import('node:fs/promises').then(fs => fs.readdir(targetDir));
    if (files.length > 0 && !result.force) {
      p.log.error(
        pc.red(
          `Directory "${result.projectName}" already exists and is not empty. Use --force to overwrite.`,
        ),
      );
      process.exit(1);
    }
  }

  await mkdir(targetDir, { recursive: true });

  // Download and extract
  const s = p.spinner();
  s.start('Downloading cabloy from npm registry...');

  try {
    await downloadAndExtract(targetDir);
    s.stop('Downloaded and extracted successfully!');
  } catch (err) {
    s.stop('Download failed', 1);
    p.log.error(pc.red(err instanceof Error ? err.message : 'Failed to download cabloy'));
    process.exit(1);
  }

  // Run npm run init
  const s2 = p.spinner();
  s2.start('Running npm run init...');

  const exitCode = await spawnAsync('npm', ['run', 'init'], {
    cwd: targetDir,
  });

  if (exitCode !== 0) {
    s2.stop('Init failed', 1);
    p.log.error(pc.red('npm run init failed. You can try running it manually.'));
  } else {
    s2.stop('Project initialized successfully!');
  }

  p.outro(
    `${pc.green(' Done! ')}Next steps:\n${pc.dim(`  cd ${result.projectName}\n`)}${pc.dim('  npm run dev\n')}`,
  );
}

main().catch(err => {
  p.log.error(pc.red(err.message));
  process.exit(1);
});
