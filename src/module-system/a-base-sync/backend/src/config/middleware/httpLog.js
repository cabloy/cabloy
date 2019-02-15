module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function httpLog(ctx, next) {
    await next();

    // check if log
    const _config = ctx.config.module(moduleInfo.relativeName);
    if (!_config.httpLog) return;

    //
    const req = ctx.request;
    const res = ctx.response;

    // check if json
    if (res.type.indexOf('application/json') === -1) return;

    // log
    let log = '';
    // query
    if (req.query && Object.keys(req.query).length > 0) {
      log = `${log}
query:
${JSON.stringify(req.query)}`;
    }
    // params
    if (req.params && Object.keys(req.params).length > 0) {
      log = `${log}
params:
${JSON.stringify(req.params)}`;
    }
    // body
    if (req.body && Object.keys(req.body).length > 0) {
      log = `${log}
body:
${JSON.stringify(req.body)}`;
    }
    // res
    log = `${log}
response:
${JSON.stringify(res.body)}`;
    // log
    ctx.logger.info(log);
  };
};
