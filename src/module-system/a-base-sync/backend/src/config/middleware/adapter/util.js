module.exports = ctx => {
  class Util {
    page(_page, force = true) {
      _page = _page || { index: 0 };
      if (force || _page.size === undefined) _page.size = ctx.app.config.pageSize;
      return _page;
    }
    user(_user) {
      return _user || ctx.user.op;
    }
  }

  return Util;
};
