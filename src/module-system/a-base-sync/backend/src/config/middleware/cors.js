const require3 = require('require3');
const URL = require('url').URL;
const extend = require3('extend2');
const isSafeDomainUtil = require3('egg-security').utils.isSafeDomain;
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
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function cors(ctx, next) {
    // options
    const optionsCors = extend(true, {}, optionsDefault, options);

    // whiteList
    let whiteListCors;
    const _config = ctx.config.module(moduleInfo.relativeName);
    const _whiteList = (_config && _config.cors && _config.cors.whiteList) || [];
    if (!Array.isArray(_whiteList)) {
      whiteListCors = _whiteList.split(',');
    } else {
      whiteListCors = _whiteList.concat();
    }
    // inherits from jsonp
    let _whiteListJsonp = _config && _config.jsonp && _config.jsonp.whiteList;
    if (_whiteListJsonp) {
      if (!Array.isArray(_whiteListJsonp)) {
        _whiteListJsonp = _whiteListJsonp.split(',');
      }
      whiteListCors = whiteListCors.concat(_whiteListJsonp);
    }

    // origin
    // if security plugin enabled, and origin config is not provided, will only allow safe domains support CORS.
    optionsCors.origin = optionsCors.origin || function corsOrigin(ctx) {
      // origin is {protocol}{hostname}{port}...
      const origin = ctx.get('origin');
      if (!origin) return '';

      let parsedUrl;
      try {
        parsedUrl = new URL(origin);
      } catch (err) {
        return '';
      }

      if (isSafeDomainUtil(parsedUrl.hostname, whiteListCors) || isSafeDomainUtil(origin, whiteListCors)) {
        return origin;
      }
      return '';
    };

    // cors
    const fn = koaCors(optionsCors);
    await fn(ctx, next);
  };
};
