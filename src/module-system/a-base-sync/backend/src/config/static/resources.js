module.exports = app => {
  const resourcedeprecated = require('./resource/deprecated.js')(app);
  const resourceFunctions = require('./resource/functions.js')(app);
  const resourceMenus = require('./resource/menus.js')(app);
  const resourceMines = require('./resource/mines.js')(app);

  let resources = [];
  resources = resources.concat(resourcedeprecated);
  resources = resources.concat(resourceFunctions);
  resources = resources.concat(resourceMenus);
  resources = resources.concat(resourceMines);
  // ok
  return resources;
};
