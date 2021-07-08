const note = require('./schema/note.js');

module.exports = app => {
  const schemas = {};
  // note
  Object.assign(schemas, note(app));
  // ok
  return schemas;
};
