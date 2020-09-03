class simpleAopBase {

  actionSync(context, next) {
    next();
    context.result = `${context.result}:simpleaop`;
  }

}

module.exports = ctx => {
  class simpleAop extends simpleAopBase {

    get__name(context, next) {
      next();
      context.value = `${context.value}:simpleaop`;
    }

    set__name(context, next) {
      const parts = context.value.split(':');
      const index = parts.indexOf('simpleaop');
      if (index > -1) {
        parts.splice(index, 1);
      }
      context.value = parts.join(':');
      next();
    }

    async actionAsync(context, next) {
      await next();
      context.result = `${context.result}:simpleaop`;
    }

  }

  return simpleAop;
};
