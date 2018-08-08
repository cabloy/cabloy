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
        while (page.$parent.$options._componentTag !== 'eb-view') {
          page = page.$parent;
        }
        return page;
      },
    });
  };

  return { beforeCreate };
}
