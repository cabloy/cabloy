const require3 = require('require3');
const uuid = require3('uuid');

module.exports = app => {

  class Share extends app.Service {

    async generate({ host, atomId, url, user }) {
      const userId = user.id;
      // get
      let item = await this.ctx.model.share.get({
        host, atomId, url, userId,
      });
      // insert
      if (!item) {
        item = {
          uuid: uuid.v4().replace(/-/g, ''),
          atomId,
          userId,
          host,
          url,
        };
        const res = await this.ctx.model.share.insert(item);
        item.id = res.insertId;
      }
      // link
      const link = item.id;
      // ok
      return { link };
    }

  }

  return Share;
};
