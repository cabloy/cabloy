export default function() {

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$view', {
      get() {
        return ctx.$f7router && ctx.$f7router.view.$el[0].__vue__;
      },
    });
    Object.defineProperty(ctx, '$page', {
      get() {
        const pageEl = ctx.$$(ctx.$el).parents('.page');
        let page = pageEl.length > 0 && pageEl[0].__vue__;
        if (!page) return null;
        if (page.$options._componentTag !== 'eb-page') {
          page = page.$children[0];
          if (page.$options._componentTag !== 'eb-page') throw new Error('not found eb-page');
        }
        return page.$parent;
      },
    });
  };

  return { beforeCreate };
}
