const layoutAtomItemApp = require('./layout/layoutAtomItemApp.js');
const layoutAtomListApp = require('./layout/layoutAtomListApp.js');

module.exports = app => {
  const layouts = [
    layoutAtomItemApp(app), //
    layoutAtomListApp(app),
  ];
  return layouts;
};
