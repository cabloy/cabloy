module.exports = app => {
  class Tag extends app.Service {
    async list({ atomClass, options }) {
      return await this.ctx.bean.tag.list({ atomClass, options });
    }

    async add({ atomClass, data }) {
      return await this.ctx.bean.tag.add({ atomClass, data });
    }

    async delete({ tagId }) {
      return await this.ctx.bean.tag.delete({ tagId });
    }

    async save({ tagId, data }) {
      return await this.ctx.bean.tag.save({ tagId, data });
    }
  }

  return Tag;
};
