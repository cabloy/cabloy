module.exports = class UtilController {
  async md() {
    // atomId
    const atomId = this.ctx.params.atomId;
    // article
    const article = await this.ctx.bean.atom.read({ key: { atomId }, user: this.ctx.state.user.op });
    if (!article) this.ctx.throw.module('a-base', 1002);
    // ok
    this.ctx.status = 200;
    this.ctx.body = article.content;
    this.ctx.set('content-type', 'text/x-markdown; charset=UTF-8');
  }
};
