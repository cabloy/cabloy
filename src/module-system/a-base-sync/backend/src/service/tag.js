module.exports = app => {

  class Tag extends app.Service {

    async list({ atomClass, options }) {
      return await this.ctx.bean.tag.list({ atomClass, options });
    }

  }

  return Tag;
};
