const is = require('is-type-of');

module.exports = function mixinClasses(classMain, classesMore, ...args) {
  // classesMore
  if (!Array.isArray(classesMore)) {
    classesMore = [classesMore];
  }
  // classMain
  if (is.function(classMain) && !is.class(classMain)) {
    classMain = classMain(...args);
  }
  if (classMain.__eb_mixined) return classMain;
  // classesMore
  const mixins = [];
  for (const _class of classesMore) {
    if (is.function(_class) && !is.class(_class)) {
      mixins.push(_class(...args));
    } else {
      mixins.push(_class);
    }
  }
  // mixin
  for (const mixin of mixins) {
    copyProperties(classMain, mixin); // copy static
    copyProperties(classMain.prototype, mixin.prototype); // copy prototype
  }
  // record
  classMain.__eb_mixined = true;
  // ok
  return classMain;
};

function copyProperties(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
