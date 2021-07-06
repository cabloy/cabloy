module.exports = app => {
  class Detail extends app.Service {
    async create({ atomKey, detailClass, item, user }) {
      return await this.ctx.bean.detail.create({ atomKey, detailClass, item, user });
    }

    async read({ key, options, user }) {
      return await this.ctx.bean.detail.read({ key, options, user });
    }

    async select({ atomKey, detailClass, options, user }) {
      return await this.ctx.bean.detail.select({ atomKey, detailClass, options, user });
    }

    async count({ atomKey, detailClass, options, user }) {
      return await this.ctx.bean.detail.count({ atomKey, detailClass, options, user });
    }

    async write({ key, item, options, user }) {
      return await this.ctx.bean.detail.write({ key, item, options, user });
    }

    async delete({ key, user }) {
      return await this.ctx.bean.detail.delete({ key, user });
    }

    async clone({ key, user }) {
      return await this.ctx.bean.detail.clone({ key, user });
    }

    async moveUp({ key, user }) {
      return await this.ctx.bean.detail.moveUp({ key, user });
    }

    async moveDown({ key, user }) {
      return await this.ctx.bean.detail.moveDown({ key, user });
    }

    async actions({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this.ctx.bean.detail.actions({ flowTaskId, atomKey, detailClass, mode, user });
    }

    async actionsBulk({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this.ctx.bean.detail.actionsBulk({ flowTaskId, atomKey, detailClass, mode, user });
    }

    async validator({ detailClass }) {
      return await this.ctx.bean.detail.validator({ detailClass });
    }
  }

  return Detail;
};
