const path = require('path');
const fs = require('fs');
const globby = require('globby');
const CovCommand = require('@zhennann/egg-bin').CovCommand;
const utils = require('../utils.js');

class BackendCovCommand extends CovCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-cov';
  }

  *run(context) {
    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), 'src/backend');
    if (!context.env.EGG_FRAMEWORK) context.env.EGG_FRAMEWORK = utils.getModulePath('egg-born-backend');

    context.argv._ = utils.combineTestPattern({
      baseDir: context.env.EGG_BASE_DIR,
      env: 'unittest',
      pattern: context.argv._,
    });

    context.argv.x = ['src/**/backend/**/*.spec.js', 'src/**/dist/backend.js'];

    // check dev server
    const devServerRunning = yield utils.checkIfDevServerRunning({
      warnWhenRunning: true,
    });
    if (devServerRunning) return;

    yield super.run(context);
  }

  /**
   * format test args then change it to array style
   * @param {Object} context - { cwd, argv, ...}
   * @param context.argv
   * @param context.debugOptions
   * @return {Array} [ '--require=xxx', 'xx.test.js' ]
   * @protected
   */
  *formatTestArgs({ argv, debugOptions }) {
    const testArgv = Object.assign({}, argv);

    /* istanbul ignore next */
    testArgv.timeout = testArgv.timeout || process.env.TEST_TIMEOUT || 3600 * 1000;
    testArgv.reporter = testArgv.reporter || process.env.TEST_REPORTER;
    // force exit
    testArgv.exit = true;

    // whether is debug mode, if pass --inspect then `debugOptions` is valid
    // others like WebStorm 2019 will pass NODE_OPTIONS, and egg-bin itself will be debug, so could detect `process.env.JB_DEBUG_FILE`.

    if (debugOptions || process.env.JB_DEBUG_FILE) {
      // --no-timeout
      testArgv.timeout = false;
    }

    // collect require
    let requireArr = testArgv.require || testArgv.r || [];
    /* istanbul ignore next */
    if (!Array.isArray(requireArr)) requireArr = [requireArr];

    // clean mocha stack, inspired by https://github.com/rstacruz/mocha-clean
    // [mocha built-in](https://github.com/mochajs/mocha/blob/master/lib/utils.js#L738) don't work with `[npminstall](https://github.com/cnpm/npminstall)`, so we will override it.
    if (!testArgv.fullTrace) requireArr.unshift(require.resolve('@zhennann/egg-bin/lib/mocha-clean'));

    // requireArr.push(require.resolve('co-mocha'));

    if (requireArr.includes('intelli-espower-loader')) {
      console.warn("[egg-bin] don't need to manually require `intelli-espower-loader` anymore");
    } else {
      requireArr.push(require.resolve('intelli-espower-loader'));
    }

    // for power-assert
    if (testArgv.typescript) {
      // remove ts-node in context getter on top.
      requireArr.push(require.resolve('espower-typescript/guess'));
    }

    testArgv.require = requireArr;

    let pattern;
    // changed
    if (testArgv.changed) {
      pattern = yield this._getChangedTestFiles();
      if (!pattern.length) {
        console.log('No changed test files');
        return;
      }
    }

    if (!pattern) {
      // specific test files
      pattern = testArgv._.slice();
    }
    if (!pattern.length && process.env.TESTS) {
      pattern = process.env.TESTS.split(',');
    }

    // collect test files
    if (!pattern.length) {
      pattern = [`test/**/*.test.${testArgv.typescript ? 'ts' : 'js'}`];
    }
    // by zhennann
    // pattern = pattern.concat([ '!test/fixtures', '!test/node_modules' ]);

    // expand glob and skip node_modules and fixtures
    const files = globby.sync(pattern);
    files.sort();

    if (files.length === 0) {
      console.log(`No test files found with ${pattern}`);
      return;
    }

    // auto add setup file as the first test file
    const setupFile = path.join(process.cwd(), `test/.setup.${testArgv.typescript ? 'ts' : 'js'}`);
    if (fs.existsSync(setupFile)) {
      files.unshift(setupFile);
    }
    testArgv._ = files;

    // remove alias
    testArgv.$0 = undefined;
    testArgv.r = undefined;
    testArgv.t = undefined;
    testArgv.g = undefined;
    testArgv.typescript = undefined;
    testArgv['dry-run'] = undefined;
    testArgv.dryRun = undefined;

    return this.helper.unparseArgv(testArgv);
  }

  description() {
    return 'backend cov';
  }
}

module.exports = BackendCovCommand;
