export default function(Vue) {
  // device
  const device = Vue.prototype.$device;
  // ua
  const ua = navigator.userAgent.toLowerCase() || '';
  // wxwork
  device.wxwork = ua.indexOf('wxwork') > -1;
  // wechat
  device.wechat = !device.wxwork && (ua.indexOf('micromessenger') > -1 || ua.indexOf('micromessage') > -1);
}
