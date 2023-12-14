const MixinClassesFn = require('mixin-classes');

module.exports = function () {
  return {
    mixinClasses(classMain, classesMore, ...args) {
      return MixinClassesFn(classMain, classesMore, ...args);
    },
  };
};
