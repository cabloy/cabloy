module.exports = class ProxyMagic {
  // magic
  __get__(context, next) {
    next();
    const prop = context.prop;
    if (prop === 'magic') {
      context.value = 'magic:simpleaop';
    }
    // if (prop === 'name') {
    //   context.value = `${context.value}:simpleaop`;
    // }
  }

  __set__(context, next) {
    // const prop = context.prop;
    // if (prop === 'name') {
    //   const parts = context.value.split(':');
    //   const index = parts.indexOf('simpleaop');
    //   if (index > -1) {
    //     parts.splice(index, 1);
    //   }
    //   context.value = parts.join(':');
    // }
    next();
  }
};
