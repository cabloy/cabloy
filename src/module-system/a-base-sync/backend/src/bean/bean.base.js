const base_0 = require('./bean.base/bean.base_0.js');
const base_actions = require('./bean.base/bean.base_actions.js');
const base_atomClasses = require('./bean.base/bean.base_atomClasses.js');
const base_authProviders = require('./bean.base/bean.base_authProviders.js');
const base_localeModules = require('./bean.base/bean.base_localeModules.js');
const base_locales = require('./bean.base/bean.base_locales.js');
const base_modules = require('./bean.base/bean.base_modules.js');
const base_resourceTypes = require('./bean.base/bean.base_resourceTypes.js');
const base_themes = require('./bean.base/bean.base_themes.js');
const base_utils = require('./bean.base/bean.base_utils.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    base_0,
    [
      base_actions, //
      base_atomClasses,
      base_authProviders,
      base_localeModules,
      base_locales,
      base_modules,
      base_resourceTypes,
      base_themes,
      base_utils,
    ],
    ctx
  );
};
