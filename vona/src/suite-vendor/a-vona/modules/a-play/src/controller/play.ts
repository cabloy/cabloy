import type { IArgv } from 'vona';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase, pathToHref } from 'vona';
import { Arg, Controller, Web } from 'vona-module-a-web';
import parser from 'yargs-parser';

import { DtoPlay } from '../dto/play.ts';

const __template = `import type { IArgv, VonaApplication } from 'vona';

export async function main(app: VonaApplication, _argv: IArgv) {
  console.log(import.meta.filename);
  console.log(app.config.meta);
  return 'Hello VonaJS';
}
`;

export interface IControllerOptionsPlay extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPlay>('play', {
  meta: { mode: ['test', 'dev'] },
  exclude: true,
})
export class ControllerPlay extends BeanBase {
  @Web.post()
  async index(@Arg.body() play: DtoPlay) {
    const argv = parser(play.args);
    let mainFile: string;
    if (argv._[0]?.endsWith('.ts')) {
      mainFile = argv._[0];
      argv._ = argv._.slice(1);
    } else {
      mainFile = 'index.ts';
    }
    return await this.playRun(argv, mainFile, play.projectPath);
  }

  async playRun(argv: IArgv, mainFile: string, projectPath: string) {
    // play
    const playFile = path.join(projectPath, `src/backend/play/${mainFile}`);
    if (!fse.existsSync(playFile)) {
      await fse.outputFile(playFile, __template);
    }
    // run
    const playFile2 = `${pathToHref(playFile)}?${Date.now()}`;
    const playInstance = await import(playFile2);
    return await playInstance.main(this.app, argv);
  }
}
