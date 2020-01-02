const require3 = require('require3');
const extend = require3('extend2');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = () => {
  return async function instance(ctx, next) {

    const timeout = ctx.config.module('a-instance').cache.timeout;
    let instance = timeout > 0 ? ctx.cache.mem.get('instance') : null;
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance) {
        // config
        instance.config = JSON.parse(instance.config) || {};
        // ctx.host ctx.protocol
        if (ctxHostValid(ctx)) {
          if (!instance.config['a-base']) instance.config['a-base'] = {};
          const aBase = instance.config['a-base'];
          if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
            aBase.host = ctx.host;
            aBase.protocol = ctx.protocol;
            await ctx.db.update('aInstance', {
              id: instance.id,
              config: JSON.stringify(instance.config) });
          }
        }
        // cache configs
        const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
        ctx.cache.mem.set('instanceConfigs', instanceConfigs);
        // cache
        //   if !host && !protocol then try to get them on next call
        if (ctxHostValid(ctx) && timeout > 0) {
          ctx.cache.mem.set('instance', instance, timeout);
        }
      }
    }

    if (!/\/version\/init/.test(ctx.request.url) && (!instance || instance.disabled)) {
      // prompt
      if (!instance && ctx.app.meta.isLocal) {
        const urlInfo = ctx.locale === 'zh-cn' ? 'https://cabloy.com/zh-cn/articles/multi-instance.html' : 'https://cabloy.com/articles/multi-instance.html';
        let message = `Please add instance in ${chalk.keyword('cyan')('src/backend/config/config.local.js')}`;
        message += '\n' + chalk.keyword('orange')(`{ subdomain: '${ctx.subdomain}', password: '', title: '' }`);
        message += `\nMore info: ${chalk.keyword('cyan')(urlInfo)}`;
        console.log('\n' + boxen(message, boxenOptions));
      }
      // locked
      ctx.throw(423);
    }

    ctx.instance = instance;

    // next
    await next();
  };
};

function ctxHostValid(ctx) {
  return ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}
