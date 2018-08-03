const SettingsFn = require('./adapter/settings.js');
const SETTINGS = Symbol('CTX#__SETTINGS');

module.exports = () => {
  return async function settings(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'settings', {
      get() {
        if (ctx.meta[SETTINGS] === undefined) {
          ctx.meta[SETTINGS] = new (SettingsFn(ctx))();
        }
        return ctx.meta[SETTINGS];
      },
    });

    // next
    await next();
  };
};
