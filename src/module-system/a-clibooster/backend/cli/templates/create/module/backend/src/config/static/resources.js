const functions = require('./resource/functions.js');
const menus = require('./resource/menus.js');
const mines = require('./resource/mines.js');
const widgets = require('./resource/widgets.js');
const blocks = require('./resource/blocks.js');
const deprecateds = require('./resource/deprecateds.js');

module.exports = app => {
  let resources = [];
  resources = resources.concat(functions(app));
  resources = resources.concat(menus(app));
  resources = resources.concat(mines(app));
  resources = resources.concat(widgets(app));
  resources = resources.concat(blocks(app));
  resources = resources.concat(deprecateds(app));
  return resources;
};
