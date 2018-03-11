export default function() {

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$view', {
      get() {
        return ctx.$f7Router.view.$el[0].__vue__;
      },
    });
  };

  return { beforeCreate };
}
