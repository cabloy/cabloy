module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // prepare entities
      const entities = this.__prepareEntities();
      const total = entities.length;
      for (let index = 0; index < total; index++) {
        const entity = entities[index];
        // log
        await this.console.log({
          progressNo: 0,
          total,
          progress: index,
          text: entity.name,
        });
        // git commit
        const message = argv.message;
        await this.helper.gitCommit({
          cwd: entity.root,
          message,
        });
      }
    }

    __prepareEntities() {}
  }

  return Cli;
};
