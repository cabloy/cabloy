const require3 = require('require3');
const extend = require3('extend2');
const assert = require3('assert');
const dashboardProfileDefault = require('./dashboardProfile.json');

module.exports = app => {

  class UserVerifyController extends app.Controller {

    async userVerify() {
      const data = this.ctx.request.body.data;
      // console.log('onUserVerify profileId: ', data.profileUser.profileId);
      assert(data.profileUser.profileId > 0);
      this.ctx.success();
    }

    async loginInfo() {
      // change the config of mobile layout by checking the user's login status
      const data = this.ctx.request.body.data;
      const info = data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-authgithub' && provider.providerName === 'authgithub') {
        info.config = extend(true, info.config, {
          modules: {
            'a-layoutmobile': {
              layout: {
                login: '/a/login/login',
                loginOnStart: true,
                toolbar: {
                  tabbar: true, labels: true, bottomMd: true,
                },
                tabs: [
                  { name: 'Mine', tabLinkActive: true, iconMaterial: 'person', url: '/a/user/user/mine' },
                ],
              },
            },
          },
        });
      }
      this.ctx.success();
    }

    async loginInfoDashboard() {
      const data = this.ctx.request.body.data;
      const info = data.info;
      info.config = extend(true, info.config, {
        modules: {
          'a-dashboard': {
            profile: {
              default: dashboardProfileDefault,
            },
          },
        },
      });
      this.ctx.success();
    }

  }

  return UserVerifyController;
};

