require.config({
  paths: {
    VConsole: 'api/static/a/base/vendor/vconsole/vconsole.min',
    VConsole_CSS: 'api/static/a/base/css/developerTool',
  },
});
define(['VConsole', 'css!VConsole_CSS'], function (VConsole) {
  return VConsole;
});
