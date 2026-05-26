import { evaluate, isNil } from '@cabloy/utils';
import BaseCommand from '@zhennann/common-bin';
import chalk from 'chalk';
import enquirer from 'enquirer';
import is from 'is-type-of';

import { BeanCli } from './bean.cli.ts';

const __envFields = [
  'TERM',
  'TERM_PROGRAM',
  'TERM_PROGRAM_VERSION',
  'SHELL',
  'COLOR',
  'LANG',
  'npm_config_registry',
];
const __comment_seperator = '====================================================================';

export class CliCommand extends BaseCommand {
  __meta: any;
  __groups: any;
  __argv: any;

  constructor(rawArgv, { meta, argv }) {
    super(rawArgv);
    this.usage = meta.info.usage; // readonly
    this.options = meta.options; // readonly
    this.version = meta.info.version;
    this.__meta = meta;
    this.__groups = meta.groups;
    this.__argv = argv;
  }

  async run(options) {
    let { argv, cwd, env, rawArgv } = options;
    // argv
    argv = this._prepareArgv(argv);
    // context
    const context = {
      brandName: process.env.CabloyCliBrandName as any,
      argv,
      cwd,
      env: this._adjustEnv({ env }),
      rawArgv,
    };
    // log start
    if (!argv.dummy) {
      // eslint-disable-next-line no-console
      console.log(`${process.env.CabloyCliBrandName} ${chalk.cyan(argv.cliFullName)} at %s\n`, cwd);
    }
    // log meta welcomes
    if (!argv.dummy) {
      this._logMetaWelcomes();
    }
    // prompt
    await this._promptGroups({ context, groups: this.__groups });
    // execute
    const beanCli = new BeanCli();
    await beanCli.execute({ context });
    // done: log cli docs
    if (!argv.dummy) {
      this._logCliDocs();
    }
    // done
    // console.log(chalk.cyan('\n  cli successfully!\n'));
  }

  _getMetaWelcomes() {
    let welcomes = this.__meta.info.welcomes;
    if (!welcomes) return null;
    if (!Array.isArray(welcomes)) welcomes = [welcomes];
    if (welcomes.length === 0) return null;
    return welcomes;
  }

  _logMetaWelcomes() {
    const welcomes = this._getMetaWelcomes();
    if (!welcomes) return;
    // eslint-disable-next-line no-console
    console.log(__comment_seperator);
    for (const welcome of welcomes) {
      // eslint-disable-next-line no-console
      console.log(welcome);
    }
    // eslint-disable-next-line no-console
    console.log(__comment_seperator);
    // eslint-disable-next-line no-console
    console.log('');
  }

  _logCliDocs() {
    const welcomes = this._getMetaWelcomes();
    if (!welcomes) return;
    const welcome = welcomes[0];
    if (!welcome || !welcome.includes('articles/cli-introduce.html')) return;
    // eslint-disable-next-line no-console
    console.log('');
    // eslint-disable-next-line no-console
    console.log(__comment_seperator);
    // eslint-disable-next-line no-console
    console.log(welcome);
    // eslint-disable-next-line no-console
    console.log(__comment_seperator);
  }

  _adjustEnv({ env }) {
    const res = {};
    for (const field of __envFields) {
      if (env[field]) res[field] = env[field];
    }
    return res;
  }

  async _promptGroups({ context, groups }) {
    for (const groupName in groups) {
      const group = groups[groupName];
      await this._promptGroup({ group, context });
    }
  }

  async _promptGroup({ group, context }) {
    const { argv } = context;
    // check
    const check = this._checkGroupCondition({ group, context });
    if (!check) return;
    // prepare
    const varsWant: any = [];
    for (const key in group.questions) {
      const value = argv[key];
      if (!isNil(value)) continue;
      const question = group.questions[key];
      const varWant = this._prepareQuestion({ group, question, key, context });
      if (varWant) {
        varsWant.push(varWant);
      }
    }
    if (varsWant.length === 0) return;
    // log description
    if (group.description) {
      // eslint-disable-next-line no-console
      console.log('===>', group.description);
    }
    // prompt
    await enquirer.prompt(varsWant);
  }

  _prepareQuestionPropertyExpression({ group, question, key, context, propName }) {
    // expression
    const expression = question[propName] && question[propName].expression;
    if (!expression) return null;
    return function (value) {
      const res = evaluate(expression, {
        value,
        group,
        question,
        key,
        context,
        arg0: context.argv._[0] ?? null,
        arg1: context.argv._[1] ?? null,
        arg2: context.argv._[2] ?? null,
        arg3: context.argv._[3] ?? null,
        arg4: context.argv._[4] ?? null,
        arg5: context.argv._[5] ?? null,
      });
      return res === null ? undefined : res;
    };
  }

  _prepareQuestion({ group, question, key, context }) {
    const { argv } = context;
    // want
    const varWant = {
      name: key,
      ...question,
    };
    // message/skip/initial/format/validate
    for (const propName of ['message', 'skip', 'initial', 'format', 'validate']) {
      const propFunction = this._prepareQuestionPropertyExpression({
        group,
        question,
        key,
        context,
        propName,
      });
      if (propFunction) {
        varWant[propName] = propFunction;
      }
    }
    // special check initial
    let initial = varWant.initial;
    if (initial && is.function(initial)) {
      initial = initial();
      if (!isNil(initial)) {
        argv[key] = initial;
        return null;
      }
    }
    // result
    varWant.result = value => {
      const propFunction = this._prepareQuestionPropertyExpression({
        group,
        question,
        key,
        context,
        propName: 'result',
      });
      if (propFunction) {
        value = propFunction(value);
      }
      argv[key] = value;
      return value;
    };
    // required
    if (question.required) {
      varWant.validate = value => {
        if (!value) return 'Required';
        return true;
      };
    }
    // ok
    return varWant;
  }

  _checkGroupCondition({ group, context }) {
    const expression = group.condition && group.condition.expression;
    if (!expression) return true;
    return evaluate(expression, { group, context });
  }

  _prepareArgv(argv: any) {
    argv = Object.assign({}, argv, this.__argv);
    delete argv.$0;
    // alias
    const options = this.__meta.options;
    if (options) {
      for (const key in options) {
        const option = options[key];
        if (option.alias && isNil(argv[key])) {
          argv[key] = argv[option.alias];
        }
      }
    }
    return argv;
  }
}
