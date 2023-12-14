const MixinClassesFn = require('../utils/mixinClasses.js');

module.exports = function () {
  return {
    mixinClasses(classMain, classesMore, ...args) {
      return MixinClassesFn(classMain, classesMore, ...args);
    },
  };
};
