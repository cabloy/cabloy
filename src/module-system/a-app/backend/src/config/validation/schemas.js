const appMenu = require('./schema/appMenu.js');
const schemaApp = require('./schema/app.js');

module.exports = app => {
  const schemas = {};
  // appMenu
  Object.assign(schemas, appMenu(app));
  // app
  Object.assign(schemas, schemaApp(app));
  // ok
  return schemas;
};
