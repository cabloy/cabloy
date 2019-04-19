const version = require('./controller/version.js');
const post = require('./controller/post.js');
const event = require('./controller/event.js');

const middlewareWrite = async function(ctx, next) {
  // validator
  const validator = await ctx.meta.atom.validator({
    atomClass: ctx.request.body.atomClass,
    user: ctx.user.op,
  });
  // validate options
  ctx.meta.middlewares.validate = {
    module: validator.module,
    validator: validator.validator,
    data: 'item',
  };
  await next();
};

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // post
    { method: 'post', path: 'post/create', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/read', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/select', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/write', controller: post, middlewares: [ 'inner', middlewareWrite, 'validate' ],
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'post/delete', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/action', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/enable', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    // event
    { method: 'post', path: 'event/atomClassValidator', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};
