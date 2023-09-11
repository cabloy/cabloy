export default function () {
  // beforeCreate
  const beforeCreate = function (ctx) {
    Object.defineProperty(ctx, '$view', {
      get() {
        const view = ctx.$f7router?.view;
        if (!view) return null;
        return view.$el[0].__vue__;
      },
    });
    Object.defineProperty(ctx, '$viewAppMethods', {
      get() {
        return ctx.$view || ctx.$meta.vueLayout.appMethods;
      },
    });
    Object.defineProperty(ctx, '$pageContainer', {
      get() {
        let page = ctx.$page;
        if (!page) return null;
        while (page.$parent.$options._componentTag !== 'eb-view') {
          page = page.$parent;
        }
        return page;
      },
    });
    Object.defineProperty(ctx, '$page', {
      get() {
        const pageEl = ctx.$$(ctx.$el).closest('.page');
        const page = pageEl.length > 0 && pageEl[0].__vue__;
        if (!page) return null;
        return page.waitForPageAfterIn ? page : page.$children[0];
      },
    });
    Object.defineProperty(ctx, '$pageRoute', {
      get() {
        const page = ctx.$page2;
        if (!page) {
          return ctx.$f7router.currentRoute;
        }
        return page.$vnode.data.props.f7route;
      },
    });
  };

  return { beforeCreate };
}
