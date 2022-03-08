const require3 = require('require3');
const pMap = require3('p-map');

module.exports = app => {
  class Util extends app.Service {
    async performAction({ params }) {
      // force innerAccess as false
      params.innerAccess = false;
      // performAction
      return await this.ctx.meta.util.performAction(params);
    }

    async performActions({ actions }) {
      // concurrency
      const mapper = async params => {
        let err;
        let res;
        try {
          res = await this.performAction({ params });
        } catch (error) {
          err = {
            code: error.code || 500,
            message: error.message,
          };
        }
        return { err, res };
      };
      return await pMap(actions, mapper, { concurrency: 10 });
    }
  }

  return Util;
};
