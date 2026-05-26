import type { CmdOptions } from '@cabloy/cli';

import { BeanCliBase } from '@cabloy/cli';
import compressing from 'compressing';
import fse from 'fs-extra';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { rimraf } from 'rimraf';
import urllib from 'urllib';
// import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    force: boolean;
    template: string;
  }
}

export class CliCreateProject extends BeanCliBase {
  httpClient: typeof urllib;

  constructor(options: CmdOptions) {
    super(options);
    this.httpClient = urllib;
  }

  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
    // project name
    const projectName = argv.name;
    // target dir
    const targetDir = path.join(argv.projectPath, projectName);
    if (!argv.force && fs.existsSync(targetDir)) {
      throw new Error(`project exists: ${projectName}`);
    }
    // template
    const template = argv.template;
    const packageName = `zova-ui-${template}`;
    // download boilerplate
    const templateDir = await this.downloadBoilerplate(packageName);
    fse.copySync(templateDir, targetDir);
    // remove LICENSE
    fse.removeSync(path.join(targetDir, 'LICENSE'));
    // copy package.json
    fse.copyFileSync(path.join(targetDir, 'package.original.json'), path.join(targetDir, 'package.json'));
    // npm run init
    await this.helper.spawnCmd({
      cmd: 'npm',
      args: ['run', 'init'],
      options: { cwd: targetDir },
    });
    // done
    await this.printUsage(targetDir);
  }

  async printUsage(targetDir: string) {
    await this.console.log(`usage:
      - cd ${targetDir}
      - pnpm install
      - npm run dev
      - npm run build
      - npm run preview
    `);
  }

  async downloadBoilerplate(packageName: string) {
    const result = await this.getPackageInfo(packageName, false);
    const tgzUrl = result.dist.tarball;

    await this.console.log(`downloading ${tgzUrl}`);

    const saveDir = path.join(os.tmpdir(), 'zova-project-boilerplate');
    await rimraf(saveDir);

    const response = await this.curl(tgzUrl, { streaming: true, followRedirect: true });
    await compressing.tgz.uncompress(response.res as any, saveDir);

    await this.console.log(`extract to ${saveDir}`);
    return path.join(saveDir, '/package');
  }

  async getPackageInfo(packageName: string, withFallback: boolean) {
    await this.console.log(`fetching npm info of ${packageName}`);
    try {
      const registry = await this.helper.getRegistry();
      const result = await this.curl(`${registry}${packageName}/latest`, {
        dataType: 'json',
        followRedirect: true,
        maxRedirects: 5,
      });
      if (result.status !== 200) {
        const message = `npm info ${packageName} got error: ${result.status}, ${result.data.reason}`;
        throw new Error(message);
      }
      return result.data;
    } catch (err) {
      if (withFallback) {
        await this.console.log(`use fallback from ${packageName}`);
        const require = createRequire(import.meta.url);
        return require(`${packageName}/package.json`);
      }
      throw err;
    }
  }

  async curl(url: string, options) {
    options = options || {};
    if (!options.timeout) {
      options.timeout = 30000;
    }
    return await this.httpClient.request(url, options);
  }
}
