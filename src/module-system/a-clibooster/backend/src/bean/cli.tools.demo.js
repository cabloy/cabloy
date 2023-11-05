const path = require('path');
const fse = require('fs-extra');

module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { cwd, argv } = this.context;
      // super
      await super.execute({ user });
      // methods
      let methods = argv._;
      if (methods.length === 0) {
        methods = ['execute']; // default method
      }
    }
  }

  return Cli;
};
