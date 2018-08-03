module.exports = app => {

  class Sequence extends app.Service {

    // next
    async next({ module, name }) {
      const res = await this.ctx.meta.sequence.module(module)._next(name);
      return res;
    }

  }

  return Sequence;
};
