const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class UserVerifyController extends app.Controller {

    async userVerify() {
      const data = this.ctx.request.body.data;
      // console.log('onUserVerify profileId: ', data.profileUser.profileId);
      assert(data.profileUser.profileId > 0);
      this.ctx.success();
    }

  }

  return UserVerifyController;
};

