const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  class eventBean {
    async execute(context, next) {
      const info = context.data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-dingtalk' && provider.providerName === 'dingtalk') {
        info.config = extend(true, info.config, {
          modules: {
            'a-layoutmobile': {
              layout: {
                presets: {
                  authenticated: {
                    scene: {
                      web: 'test-dingtalk:layoutTest',
                    },
                  },
                },
              },
            },
          },
        });
      }
      // next
      await next();
    }
  }

  return eventBean;
};
