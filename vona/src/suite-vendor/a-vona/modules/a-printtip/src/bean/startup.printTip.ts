import type { IStartupExecute } from 'vona-module-a-startup';

import chalk from 'chalk';
import { BeanBase } from 'vona';
import { Startup } from 'vona-module-a-startup';

import type { IMetaPrintTipExecute, IMetaPrintTipInfoInner } from '../types/printTip.ts';

const __tipBegin = '=================== tip: begin ===================';
const __tipEnd = '=================== tip: end =====================';

@Startup({
  instance: true,
  debounce: true,
  after: true,
  meta: { mode: 'dev' },
  dependencies: 'a-runtime:runtime',
})
export class StartupPrintTip extends BeanBase implements IStartupExecute {
  async execute() {
    if (this.app.meta.env.LOGGER_DUMMY === 'true') return;
    setTimeout(async () => {
      await this._print();
    }, this.scope.config.delay);
  }

  async _print() {
    //
    const outputs: IMetaPrintTipInfoInner[] = [];
    const onions = this.bean.onion.meta.getOnionsEnabledOfMeta(true, 'printTip');
    for (const onion of onions) {
      const beanInstance = this.bean._getBean<IMetaPrintTipExecute>(
        onion.beanOptions.beanFullName as any,
      );
      const res = await beanInstance.execute();
      if (!res) continue;
      for (const item of Array.isArray(res) ? res : [res]) {
        outputs.push({
          ...item,
          module: onion.beanOptions.module,
        });
      }
    }
    //
    const message = outputs
      .map(
        output =>
          `${chalk.gray(`[${output.module}]`)} ${chalk.magenta(output.title)}: ${chalk.cyan(output.message)}`,
      )
      .join('\n');
    const text = `\n${chalk.yellow(__tipBegin)}\n${message}\n${chalk.yellow(__tipEnd)}`;
    this.$logger.silly(text);
  }
}
