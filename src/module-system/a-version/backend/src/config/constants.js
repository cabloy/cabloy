module.exports = app => {

  const moduleInfo = app.parseModuleInfo(__dirname);

  const constants = {
    event: {
      checkReady: `eb:event:${moduleInfo.relativeName}:check-ready`,
    },
  };
  return constants;

};
