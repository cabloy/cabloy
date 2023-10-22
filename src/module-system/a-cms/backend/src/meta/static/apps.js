const appCms = require('./app/appCms.js');
// const appCmsInnerTest = require('./app/appCmsInnerTest.js');

module.exports = app => {
  const apps = [
    //
    appCms(app),
    // appCmsInnerTest(app),
  ];
  return apps;
};
