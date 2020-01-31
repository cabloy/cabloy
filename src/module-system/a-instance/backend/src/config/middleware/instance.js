const require3 = require('require3');
const extend = require3('extend2');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const regexURL_resetCache = /\/a\/instance\/instance\/broadcast\/resetCache/;
const regexURL_versionInit = /\/version\/init/;

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function instance(ctx, next) {
    // cache
    const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
    let instance = regexURL_resetCache.test(ctx.url) ? null : cacheMem.get('instance');
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance) {
        // config
        instance.config = JSON.parse(instance.config) || {};
        // cache configs
        const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
        cacheMem.set('instanceConfigs', instanceConfigs);
        // cache instance
        cacheMem.set('instance', instance);
      }
    }

    // try to save host/protocol to config
    if (instance && !instance.disabled && ctxHostValid(ctx)) {
      if (!instance.config['a-base']) instance.config['a-base'] = {};
      const aBase = instance.config['a-base'];
      if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
        aBase.host = ctx.host;
        aBase.protocol = ctx.protocol;
        // update
        await ctx.db.update('aInstance', {
          id: instance.id,
          config: JSON.stringify(instance.config) });
        // broadcast
        ctx.app.meta.broadcast.emit({
          subdomain: ctx.subdomain,
          module: 'a-instance',
          broadcastName: 'resetCache',
          data: null,
        });
      }
    }

    if (!regexURL_versionInit.test(ctx.request.url) && (!instance || instance.disabled)) {
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
  return !ctx.innerAccess && ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}
