export default function() {

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$view', {
      get() {
        return ctx.$f7Router.view.$el[0].__vue__;
      },
    });
    Object.defineProperty(ctx, '$page', {
      get() {
        const page = ctx.$$(ctx.$el).parents('.page');
        if (page.length > 0 && page[0].__vue__) return page[0].__vue__;
        return null;
      },
    });
  };

  return { beforeCreate };
}
