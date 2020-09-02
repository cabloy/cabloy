const require3 = require('require3');
const extend = require3('extend2');
const dashboardProfileDefault = require('../assets/dashboardProfile.json');

module.exports = ctx => {
  class eventBean {

    async execute(context, next) {
      const data = context.data;
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
      // next
      await next();
    }

  }

  return eventBean;
};
