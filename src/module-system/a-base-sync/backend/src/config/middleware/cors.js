const require3 = require('require3');
const extend = require3('extend2');
const koaCors = require3('@koa/cors');

const optionsDefault = {
  // origin: undefined,
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // exposeHeaders: '',
  // allowHeaders: '',
  // maxAge: 0,
  credentials: true,
  // keepHeadersOnError:undefined,
};

module.exports = (options, app) => {
  return async function cors(ctx, next) {
    // not cors (safari not send sec-fetch-mode)
    // if (ctx.headers['sec-fetch-mode'] !== 'cors') return await next();

    // options
    const optionsCors = extend(true, {}, optionsDefault, options);

    // origin
    // if security plugin enabled, and origin config is not provided, will only allow safe domains support CORS.
    optionsCors.origin = optionsCors.origin || function corsOrigin(ctx) {
      // origin is {protocol}{hostname}{port}...
      const origin = ctx.get('origin');
      if (app.meta.util.isSafeDomain(ctx, origin)) {
        return origin;
      }
      return '';
    };

    // cors
    const fn = koaCors(optionsCors);
    await fn(ctx, next);
  };
};
